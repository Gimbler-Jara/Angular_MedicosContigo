export interface DetalleCitaAtendidaDTO {
  httpStatus: number;
  mensaje: string;
  datos: DetalleCitaAtendida;
}

export interface DetalleCitaAtendidaPorIdPacienteDTO {
  httpStatus: number;
  mensaje: string;
  datos: DetalleCitaAtendida[];
}

export interface DetalleCitaAtendida {
  idCita: number;
  paciente: string;
  medico: string;
  fecha: string;
  hora: string;
  diagnostico: string;
  receta: string;
  idMedico: number;
  idPaciente: number;
}
