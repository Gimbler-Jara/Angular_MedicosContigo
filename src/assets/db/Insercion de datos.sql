-- Datos de referencia
INSERT INTO tb_document_type (Doc) VALUES 
('DNI'),
('Carnet de Extranjería'),
('Pasaporte');

INSERT INTO tb_rol (rol) VALUES 
('Paciente'),
('Médico'),
('Administrador');

INSERT INTO tb_especialidad (especialidad) VALUES 
('Traumatología'),
('Cardiología'),
('Dermatología'),
('Pediatría'),
('Oftalmología'),
('Ginecología'),
('Neurología'),
('Psiquiatría'),
('Endocrinología');

INSERT INTO tb_dia_semana (dia) VALUES 
('Lunes'), ('Martes'), ('Miércoles'), ('Jueves'), ('Viernes'), ('Sábado');

INSERT INTO tb_hora (hora) VALUES 
('08:00'),
('09:00'),
('10:00'),
('11:00'),
('12:00'),
('13:00'),
('14:00'),
('15:00'),
('16:00'),
('17:00'),
('18:00');


INSERT INTO tb_estado_cita (estado) VALUES 
('Reservado'), ('Atendido'), ('Cancelada');

INSERT INTO tb_usuario (document_type, dni, last_name, middle_name, first_name, birth_date, gender, telefono, email, password_hash, rol_id, activo)
VALUES (1, '12345678', 'Pérez', 'González', 'Juan', '1990-05-12', 'M', '987654321', 'admin@gmail.com', '$2a$10$tps1p..lRla0/yxn6Stf3.J1UfNg1zv4XYOQit3TsniX5MBhDNn9e', 3, 1);

select * from tb_document_type;
select * from tb_rol;
select * from tb_usuario;
select * from tb_especialidad;
select * from tb_paciente;
select * from tb_medico;
select * from tb_dia_semana;
select * from tb_hora;
select * from tb_estado_cita;


select * from tb_disponibilidad ;
select * from tb_cita_medica;





