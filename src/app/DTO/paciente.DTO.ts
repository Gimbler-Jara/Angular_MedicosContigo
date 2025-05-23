import { UsuarioResponse } from "../interface/Usuario/Usuario.interface";

export interface PacienteDTO {
  httpStatus: number;
  mensaje: string;
  pacientes: Paciente[];
}


export interface Paciente {
  idUsuario: number;
  usuario: UsuarioResponse;
}