-- Eliminar y crear la base de datos
DROP DATABASE IF EXISTS sistema_citas_medicas;
CREATE DATABASE sistema_citas_medicas;
USE sistema_citas_medicas;

-- Tabla de tipos de documento
CREATE TABLE tb_document_type (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Doc VARCHAR(30) NOT NULL
);

-- Tabla de roles
CREATE TABLE tb_rol (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rol VARCHAR(50) NOT NULL
);

-- Tabla de usuarios
CREATE TABLE tb_usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    document_type INT NOT NULL,
    dni VARCHAR(20) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    first_name VARCHAR(50) NOT NULL,
    birth_date DATE NOT NULL,
    gender CHAR(1) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100),
    password_hash VARCHAR(255) NOT NULL,
    rol_id INT NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT chk_gender CHECK (gender IN ('M', 'F')),
    FOREIGN KEY (document_type) REFERENCES tb_document_type(Id),
    FOREIGN KEY (rol_id) REFERENCES tb_rol(id)
);

-- Tabla de especialidades
CREATE TABLE tb_especialidad (
    id INT AUTO_INCREMENT PRIMARY KEY,
    especialidad VARCHAR(255) NOT NULL
);

-- Tabla de días de la semana
CREATE TABLE tb_dia_semana (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dia VARCHAR(255) UNIQUE NOT NULL
);

-- Tabla de horas
CREATE TABLE tb_hora (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hora VARCHAR(255) NOT NULL
);

-- Tabla de estados de citas
CREATE TABLE tb_estado_cita (
    id INT AUTO_INCREMENT PRIMARY KEY,
    estado VARCHAR(50) NOT NULL
);

-- Tabla de pacientes
CREATE TABLE tb_paciente (
    id_usuario INT PRIMARY KEY,
    FOREIGN KEY (id_usuario) REFERENCES tb_usuario(id) ON DELETE CASCADE
);

-- Tabla de médicos
CREATE TABLE tb_medico (
    id_usuario INT PRIMARY KEY,
    especialidad_id INT NOT NULL,
    url_firma_digital VARCHAR(255),
    cmp VARCHAR(10) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES tb_usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (especialidad_id) REFERENCES tb_especialidad(id)
);

-- Tabla de disponibilidad
CREATE TABLE tb_disponibilidad (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idMedico INT NOT NULL,
    idDiaSemana INT NOT NULL,
    idHora INT NOT NULL,
    especialidad_id INT NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (idMedico) REFERENCES tb_usuario(id),
    FOREIGN KEY (idDiaSemana) REFERENCES tb_dia_semana(id),
    FOREIGN KEY (idHora) REFERENCES tb_hora(id),
    FOREIGN KEY (especialidad_id) REFERENCES tb_especialidad(id)
);

-- Tabla de citas médicas
CREATE TABLE tb_cita_medica (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_medico INT NOT NULL,
    id_paciente INT NOT NULL,
    fecha DATE NOT NULL,
    idHora INT NOT NULL,
    estado INT DEFAULT 1,
    FOREIGN KEY (id_medico) REFERENCES tb_medico(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_paciente) REFERENCES tb_paciente(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (idHora) REFERENCES tb_hora(id),
    FOREIGN KEY (estado) REFERENCES tb_estado_cita(id),
    UNIQUE KEY unq_cita (id_medico, fecha, idHora)
);

CREATE TABLE tb_diagnostico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_cita INT NOT NULL,
    descripcion TEXT NOT NULL,
    fecha DATE NOT NULL,
    FOREIGN KEY (id_cita) REFERENCES tb_cita_medica(id)
);

CREATE TABLE tb_receta_medica (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_diagnostico INT NOT NULL,
    fecha DATE NOT NULL,
    FOREIGN KEY (id_diagnostico) REFERENCES tb_diagnostico(id)
);

CREATE TABLE tb_medicamento_receta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_receta INT NOT NULL,
    medicamento VARCHAR(255) NOT NULL,
    indicaciones TEXT,
    FOREIGN KEY (id_receta) REFERENCES tb_receta_medica(id)
);
