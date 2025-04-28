
export const API = "http://localhost:8081/api";

// ! /api/procedimientos/*** 
export const CITA_MEDICA = "cita-medica";
export const ENDPOINTS_CITAS = {
    CITAS_AGENDADAS: "citas-agendadas",                                                                  //* GET
    REGISTRAR_DISPONIBILIDAD: "registrar-disponibilidad",                                                //* POST
    CAMBIAR_ESTADO_DISPONIBILIDAD: "cambiar-estado-disponibilidad",                                      //* PUT
    AGENDAR_CITA: "agendar-cita",                                                                        //* POST
    // CAMBIAR_ESTADO_CITA_RESERVADO_ATENDIDO: "cambiar-estado-cita-reservado-atendido",                 //* PUT
    ELIMINAR_CITA_RESERVADO: "eliminar-cita",                                                             //* DELETE   
    CITAS_RESERVADAS_POR_PACIENTE: "citas-reservadas-paciente",                                           //* GET
}

// * /api/usuarios/***
export const USUARIO = "usuarios";

// * /api/medicos
export const MEDICOS = "medicos"        //** GET
export const ENDPOINTS_MEDICO = {
    ESPECIALIDAD_POR_ID_MEDICO: "especialidad_por_id_medico",                   //* GET
    MEDICOS_POR_ESPECIALIDAD: "medicos-por-especialidad",                     //* GET
    DIAS_DISPONIBLES: "dias-disponibles",                                       //* GET
    HORAS_DISPONIBLES: "horas-disponibles",                                     //* GET
    HORARIO_TRABAJO_MEDICO: "horario-trabajo-medico",                             //* GET
}

// * /api/pacientes
export const PACIENTES = "pacientes"    //** GET

// *  /api/document-types 
export const DOCUMENT_TYPE = "document-types"    //** GET

// ! /api/especialidades
export const ENDPOINT_ESPECIALIDADES = {
    ESPECIALIDADES: "especialidades"
}

// export const MEDICO_POR_ESPECIALIDAD = "medicos-por-especialidad";
// export const DIAS_DISPONIBLES = "dias-disponibles";

// export const CITAS_RESERVADAS_POR_PACIENTE = "citas-reservadas-paciente"
// export const ESPECIALIDAD_POR_ID_MEDICO = "especialidad_por_id_medico"