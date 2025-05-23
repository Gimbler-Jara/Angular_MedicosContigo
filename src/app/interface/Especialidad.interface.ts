export interface EspecialidadResponse {
  httpstatus: number,
  mensaje: string,
  especialidades: Especialidad[]
}

export interface EspecialidadPorMedicoResponse {
  httpstatus: number,
  mensaje: string,
  especialidad: Especialidad
}

export interface Especialidad {
  id: number;
  especialidad: string;
}
