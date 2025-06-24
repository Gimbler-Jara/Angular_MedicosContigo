// SPRING BOOT
export const API = "http://localhost:8080/api";
// export const API = 'https://sb-sistema-citas-medicas-api.onrender.com/api';

// ! /api/procedimientos/***
export const CITA_MEDICA = 'cita-medica';
export const ENDPOINTS_CITAS = {
  CITAS_AGENDADAS: 'citas-agendadas', //* GET
  REGISTRAR_DISPONIBILIDAD: 'registrar-disponibilidad', //* POST
  CAMBIAR_ESTADO_DISPONIBILIDAD: 'cambiar-estado-disponibilidad', //* PUT
  AGENDAR_CITA: 'agendar-cita', //* POST
  CAMBIAR_ESTADO_CITA_RESERVADO_ATENDIDO:
    'cambiar-estado-cita-reservado-atendido', //* PUT
  ELIMINAR_CITA_RESERVADO: 'eliminar-cita', //* DELETE
  CITAS_RESERVADAS_POR_PACIENTE: 'citas-reservadas-paciente', //* GET
  HISTORIAL: 'historial', //* GET
  HISTORIAL_PACIENTE: 'historial-paciente', //* GET
};

// * /api/usuarios/***
export const USUARIO = 'usuarios';
export const ENDPOINTS_USUARIO = {
  CAMBIAR_ESTADO: 'cambiar-estado-usuario', //* PUT
  LOGIN: 'login',
  ME: 'me',
  PERFIL_TOKEN: 'perfil-token',
};

// * /api/medicos
export const MEDICOS = 'medicos'; //** GET
export const ENDPOINTS_MEDICO = {
  ESPECIALIDAD_POR_ID_MEDICO: 'especialidad_por_id_medico', //* GET
  MEDICOS_POR_ESPECIALIDAD: 'medicos-por-especialidad', //* GET
  DIAS_DISPONIBLES: 'dias-disponibles', //* GET
  HORAS_DISPONIBLES: 'horas-disponibles', //* GET
  HORARIO_TRABAJO_MEDICO: 'horario-trabajo-medico', //* GET
  OBTENER_FIRMA: 'obtnerFirma',
};

// * /api/pacientes
export const PACIENTES = 'pacientes'; //** GET

// *  /api/document-types
export const DOCUMENT_TYPE = 'document-types'; //** GET

// ! /api/especialidades
export const ENDPOINT_ESPECIALIDADES = {
  ESPECIALIDADES: 'especialidades', //** GET
};

//DIAS SEMANA
export const DIAS_SEMANA = 'diasSemana';
