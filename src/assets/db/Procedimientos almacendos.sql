
USE sistema_citas_medicas;

-- =========================================
-- Procedimiento: usp_listar_citas_Agendadas
-- Descripción: Lista todas las citas médicas agendadas para un médico específico.
-- =========================================
DELIMITER //
CREATE PROCEDURE usp_listar_citas_Agendadas(IN idMedico INT)
BEGIN
    SELECT 
        c.id,
        c.fecha,
        h.hora,
        ec.estado,
        pu.dni AS PacienteDNI,
        CONCAT(pu.first_name, ' ', pu.last_name, ' ', pu.middle_name) AS PacienteNombre,
        mu.id AS MedicoId,
        CONCAT(mu.first_name, ' ', mu.last_name) AS MedicoNombre,
        e.especialidad AS Especialidad,
        c.tipo_cita
    FROM tb_cita_medica c
    JOIN tb_paciente p ON c.id_paciente = p.id_usuario
    JOIN tb_usuario pu ON p.id_usuario = pu.id
    JOIN tb_medico m ON c.id_medico = m.id_usuario
    JOIN tb_usuario mu ON m.id_usuario = mu.id
    JOIN tb_especialidad e ON m.especialidad_id = e.id
    JOIN tb_hora h ON c.idHora = h.id
    JOIN tb_estado_cita ec ON c.estado = ec.id
    WHERE mu.id = idMedico;
END //
DELIMITER ;

-- =========================================
-- Procedimiento: sp_registrar_disponibilidad
-- Descripción: Registra una nueva disponibilidad de horario para un médico si no existe previamente.
-- =========================================
DELIMITER //
CREATE PROCEDURE sp_registrar_disponibilidad(
    IN p_idMedico INT,
    IN p_idDiaSemana INT,
    IN p_idHora INT,
    IN p_idEspecialidad INT
)
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM tb_disponibilidad
        WHERE idMedico = p_idMedico
          AND idDiaSemana = p_idDiaSemana
          AND idHora = p_idHora
    ) THEN
        INSERT INTO tb_disponibilidad (idMedico, idDiaSemana, idHora, especialidad_id, activo)
        VALUES (p_idMedico, p_idDiaSemana, p_idHora, p_idEspecialidad, 1);
        SELECT 1 AS success, 'Disponibilidad registrada correctamente' AS message;
    ELSE
        SELECT 0 AS success, 'La disponibilidad ya existe' AS message;
    END IF;
END //
DELIMITER ;

-- =========================================
-- Procedimiento: sp_cambiar_estado_disponibilidad
-- Descripción: Cambia el estado (activo/inactivo) de la disponibilidad de un médico en un horario específico.
-- =========================================
DELIMITER //
CREATE PROCEDURE sp_cambiar_estado_disponibilidad(
    IN p_idMedico INT,
    IN p_idDiaSemana INT,
    IN p_idHora INT,
    IN p_activo TINYINT(1)
)
BEGIN
    UPDATE tb_disponibilidad
    SET activo = p_activo
    WHERE idMedico = p_idMedico
      AND idDiaSemana = p_idDiaSemana
      AND idHora = p_idHora;
END //
DELIMITER ;


-- =========================================
-- Procedimiento: sp_agendar_cita
-- Descripción: Agenda una nueva cita médica si existe disponibilidad para el médico en ese día y hora.
-- =========================================
DELIMITER //
CREATE PROCEDURE sp_agendar_cita(
    IN p_idMedico INT,
    IN p_idPaciente INT,
    IN p_fecha DATE,
    IN p_idHora INT,
    IN p_tipoCita INT
)
BEGIN
    DECLARE v_dia_semana INT;
    DECLARE v_count INT;

    -- Verificar que el médico exista en tb_medico
    SELECT COUNT(*) INTO v_count FROM tb_medico WHERE id_usuario = p_idMedico;
    IF v_count = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El médico especificado no existe.';
    END IF;

    -- Calcular día de la semana (1 = lunes, 7 = domingo)
    SET v_dia_semana = WEEKDAY(p_fecha) + 1;

    -- Validar disponibilidad y ausencia de conflicto
    IF EXISTS (
        SELECT 1 FROM tb_disponibilidad d
        WHERE d.idMedico = p_idMedico
          AND d.idDiaSemana = v_dia_semana
          AND d.idHora = p_idHora
          AND d.activo = 1
    ) AND NOT EXISTS (
        SELECT 1 FROM tb_cita_medica c
        WHERE c.id_medico = p_idMedico AND c.fecha = p_fecha AND c.idHora = p_idHora
    ) THEN
        INSERT INTO tb_cita_medica (id_medico, id_paciente, fecha, idHora, estado, tipo_cita)
        VALUES (p_idMedico, p_idPaciente, p_fecha, p_idHora, 1, p_tipoCita);
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No hay disponibilidad para el horario seleccionado.';
    END IF;
END //
DELIMITER ;

-- =========================================
-- Procedimiento: sp_listar_especialidades
-- Descripción: Lista todas las especialidades médicas disponibles.
-- =========================================
DELIMITER //
CREATE PROCEDURE sp_listar_especialidades()
BEGIN
    SELECT id, especialidad FROM tb_especialidad ORDER BY especialidad;
END //
DELIMITER ;


-- =========================================
-- Procedimiento: sp_listar_medicos_por_especialidad
-- Descripción: Lista los médicos registrados de una especialidad específica.
-- =========================================
DELIMITER //
CREATE PROCEDURE sp_listar_medicos_por_especialidad(IN idEspecialidad INT)
BEGIN
    SELECT 
        m.id_usuario AS idMedico,
        CONCAT(u.first_name, ' ', u.last_name) AS nombreCompleto
    FROM tb_medico m
    JOIN tb_usuario u ON u.id = m.id_usuario
    WHERE m.especialidad_id = idEspecialidad AND u.activo = true
    ORDER BY nombreCompleto;
END //
DELIMITER ;

-- =========================================
-- Procedimiento: sp_listar_dias_disponibles_por_medico
-- Descripción: Lista los días de la semana en los que un médico tiene disponibilidad activa.
-- =========================================
DELIMITER //
CREATE PROCEDURE sp_listar_dias_disponibles_por_medico(IN idMedico INT)
BEGIN
    SELECT DISTINCT ds.id AS idDiaSemana, ds.dia
    FROM tb_disponibilidad d
    JOIN tb_dia_semana ds ON ds.id = d.idDiaSemana
    WHERE d.idMedico = idMedico AND d.activo = 1;
END //
DELIMITER ;


-- =========================================
-- Procedimiento: sp_listar_horas_disponibles
-- Descripción: Lista las horas disponibles de un médico para una fecha específica, considerando la disponibilidad y citas existentes.
-- =========================================
DELIMITER //
CREATE PROCEDURE sp_listar_horas_disponibles(
    IN idMedico INT,
    IN fecha DATE
)
BEGIN
    DECLARE idDiaSemana INT;
    SET idDiaSemana = WEEKDAY(fecha) + 1;

    SELECT h.id AS idHora, h.hora
    FROM tb_disponibilidad d
    JOIN tb_hora h ON h.id = d.idHora
    WHERE d.idMedico = idMedico
      AND d.idDiaSemana = idDiaSemana
      AND d.activo = 1
      AND NOT EXISTS (
          SELECT 1 
          FROM tb_cita_medica c
          WHERE c.id_medico = idMedico 
            AND c.fecha = fecha 
            AND c.idHora = d.idHora
      )
    ORDER BY h.id;
END //
DELIMITER ;

-- =========================================
-- Procedimiento: sp_atender_cita_y_crear_receta
-- Descripción: Cambia el estado de una cita médica a "atendido", 
--              registra el diagnóstico y genera la receta correspondiente.
-- Parámetros:
--   IN idCita: ID de la cita médica a atender.
--   IN descripcionDiagnostico: Texto con el diagnóstico médico.
--   OUT recetaId: ID de la receta creada para posterior relación.
-- =========================================
DELIMITER //
CREATE PROCEDURE sp_atender_cita_y_crear_receta(
    IN idCita INT,
    IN descripcionDiagnostico TEXT,
    OUT recetaId INT
)
BEGIN
    -- Cambiar estado de la cita
    UPDATE tb_cita_medica SET estado = 2 WHERE id = idCita;

    -- Insertar diagnóstico
    INSERT INTO tb_diagnostico(id_cita, descripcion, fecha)
    VALUES (idCita, descripcionDiagnostico, CURDATE());

    SET @id_diagnostico := LAST_INSERT_ID();

    -- Crear receta médica
    INSERT INTO tb_receta_medica(id_diagnostico, fecha)
    VALUES (@id_diagnostico, CURDATE());

    SET recetaId = LAST_INSERT_ID();
END //
DELIMITER ;


-- =========================================
-- Procedimiento: sp_agregar_medicamento_a_receta
-- Descripción: Agrega un medicamento a una receta médica ya existente.
-- Parámetros:
--   IN recetaId: ID de la receta a la que se le asociará el medicamento.
--   IN medicamento: Nombre del medicamento.
--   IN indicaciones: Indicaciones médicas para el uso del medicamento.
-- =========================================
DELIMITER //
CREATE PROCEDURE sp_agregar_medicamento_a_receta(
    IN recetaId INT,
    IN medicamento VARCHAR(255),
    IN indicaciones TEXT
)
BEGIN
    INSERT INTO tb_medicamento_receta(id_receta, medicamento, indicaciones)
    VALUES (recetaId, medicamento, indicaciones);
END //
DELIMITER ;


-- =========================================
-- Procedimiento: sp_obtener_historial_por_cita
-- Descripción: Retorna el historial médico completo de una cita médica,
--              incluyendo paciente, médico, diagnóstico, hora, y receta detallada.
-- Parámetros:
--   IN idCita: ID de la cita médica a consultar.
-- Resultado:
--   Una fila con los datos médicos y administrativos de la cita.
-- =========================================
DELIMITER //
CREATE PROCEDURE sp_obtener_historial_por_cita(
    IN idCita INT
)
BEGIN
    SELECT 
        c.id AS id_cita,
        c.id_paciente,
        CONCAT(up.first_name, ' ', up.last_name, ' ', up.middle_name) AS paciente,
        c.id_medico,
        CONCAT(um.first_name, ' ', um.last_name, ' ', um.middle_name) AS medico,
        c.fecha,
        h.hora,
        d.descripcion AS diagnostico,
        GROUP_CONCAT(CONCAT(m.medicamento, ' (', m.indicaciones, ')') SEPARATOR '; ') AS receta
    FROM tb_cita_medica c
    JOIN tb_diagnostico d ON c.id = d.id_cita
    JOIN tb_receta_medica r ON d.id = r.id_diagnostico
    JOIN tb_medicamento_receta m ON m.id_receta = r.id
    JOIN tb_medico md ON md.id_usuario = c.id_medico
    JOIN tb_especialidad es ON es.id = md.especialidad_id
    JOIN tb_usuario up ON up.id = c.id_paciente
    JOIN tb_usuario um ON um.id = c.id_medico
    JOIN tb_hora h ON h.id = c.idHora
    WHERE c.id = idCita
    GROUP BY 
        c.id, c.id_medico, c.id_paciente, c.fecha, d.descripcion;
END //
DELIMITER ;


-- =========================================
-- Procedimiento: sp_eliminar_cita_Reservado
-- Descripción: Elimina una cita médica solo si aún no ha sido atendida.
-- =========================================
DELIMITER //
CREATE PROCEDURE sp_eliminar_cita_Reservado(
    IN idCita INT
)
BEGIN
    DELETE FROM tb_cita_medica 
    WHERE id = idCita AND estado != 2;
END //
DELIMITER ;



-- =========================================
-- Procedimiento: sp_listar_citas_programadas_por_paciente
-- Descripción: Lista todas las citas programadas de un paciente que aún no han sido atendidas.
-- =========================================
DROP PROCEDURE IF EXISTS sp_listar_citas_programadas_por_paciente;
DELIMITER //
 CREATE PROCEDURE sp_listar_citas_programadas_por_paciente(
  IN idPaciente INT
)
BEGIN
  SELECT
  cm.id,
  u.id as idMedico,
  CONCAT(u.first_name, ' ', u.last_name) AS medico, 
  esp.especialidad,
  e.estado,
  cm.fecha,
  cm.idHora, 
  cm.tipo_cita
FROM tb_cita_medica AS cm
JOIN tb_usuario AS u ON u.id = cm.id_medico
JOIN tb_estado_cita AS e ON e.id = cm.estado
JOIN tb_medico as m ON m.id_usuario = u.id
JOIN tb_especialidad as esp on esp.id = m.especialidad_id
WHERE cm.id_paciente = idPaciente;

END //
DELIMITER ;

-- =========================================
-- Procedimiento: sp_consultar_especialidad_por_id_medico
-- Descripción: Consulta la especialidad asociada a un médico por su ID.
-- =========================================
DELIMITER //
 CREATE PROCEDURE sp_consultar_especialidad_por_id_medico(
  IN idMedico INT
)
BEGIN
 select e.id, e.especialidad from tb_medico as m
 join tb_especialidad e on e.id = m.especialidad_id
 where m.id_usuario = idMedico;
END //
DELIMITER ;



-- =========================================
-- Procedimiento: sp_listar_horarios_de_trabajo_medico
-- Descripción: Lista todos los horarios de trabajo (día y hora) de un médico específico, incluyendo estado activo/inactivo.
-- =========================================
DELIMITER //
CREATE PROCEDURE sp_listar_horarios_de_trabajo_medico(IN p_idMedico INT)
BEGIN
    SELECT 
        d.id AS id_disponibilidad,
        ds.id AS id_dia,
        ds.dia,
        h.id AS id_hora,
        h.hora,
        d.activo
    FROM tb_disponibilidad d
    JOIN tb_dia_semana ds ON d.idDiaSemana = ds.id
    JOIN tb_hora h ON d.idHora = h.id
    WHERE d.idMedico = p_idMedico;
END //
DELIMITER ;


-- ==========================================================
DELIMITER //
CREATE PROCEDURE sp_obtener_historial_por_paciente(
    IN idPaciente INT
)
BEGIN
    SELECT 
        c.id AS id_cita,
        c.id_paciente,
        CONCAT(up.first_name, ' ', up.last_name, ' ', up.middle_name) AS paciente,
        c.id_medico,
        CONCAT(um.first_name, ' ', um.last_name, ' ', um.middle_name) AS medico,
        c.fecha,
        h.hora,
        d.descripcion AS diagnostico,
        GROUP_CONCAT(CONCAT(m.medicamento, ' (', m.indicaciones, ')') SEPARATOR '; ') AS receta
    FROM tb_cita_medica c
    JOIN tb_diagnostico d ON c.id = d.id_cita
    JOIN tb_receta_medica r ON d.id = r.id_diagnostico
    JOIN tb_medicamento_receta m ON m.id_receta = r.id
    JOIN tb_medico md ON md.id_usuario = c.id_medico
    JOIN tb_especialidad es ON es.id = md.especialidad_id
    JOIN tb_usuario up ON up.id = c.id_paciente
    JOIN tb_usuario um ON um.id = c.id_medico
    JOIN tb_hora h ON h.id = c.idHora
    WHERE up.id = idPaciente
    GROUP BY 
        c.id, c.id_medico, c.id_paciente, c.fecha, d.descripcion;
END //
DELIMITER ;


-- ==========================================================
-- ================= PACIENTE =========================================
-- CALL sp_listar_especialidades();

-- CALL sp_listar_medicos_por_especialidad(1);

-- CALL sp_listar_dias_disponibles_por_medico(3);

-- CALL sp_listar_horas_disponibles(3, '2025-05-07');

-- CALL sp_agendar_cita(3, 1, '2025-04-28', 1);

-- Cambia de estado reservado a 
-- CALL sp_eliminar_cita_Reservado(5);

-- CALL sp_listar_citas_programadas_por_paciente(3);

-- ================= DOCTOR =========================================
 -- CALL usp_listar_citas_Agendadas(2);

-- CALL sp_registrar_disponibilidad(3, 1, 1, 2);    

-- Cambia de estado activo a 0
-- CALL sp_cambiar_estado_disponibilidad(3, 3, 2, 0);



-- CALL sp_consultar_especialidad_por_id_medico(3);

-- Lista los dias que atende el medico
-- CALL sp_listar_horarios_de_trabajo_medico(3);

-- Paso 1: Atender cita y crear receta
-- CALL sp_atender_cita_y_crear_receta(5,'Diagnóstico: infección urinaria',@receta_id);

-- Paso 2: Agregar medicamentos
-- CALL sp_agregar_medicamento_a_receta(@receta_id, 'Ciprofloxacina 500mg', 'Cada 12h por 7 días');
-- CALL sp_agregar_medicamento_a_receta(@receta_id, 'Ibuprofeno 400mg', 'Cada 8h por 5 días si hay dolor');

-- CALL sp_obtener_historial_por_cita(10);
-- CALL sp_obtener_historial_por_paciente(2);







