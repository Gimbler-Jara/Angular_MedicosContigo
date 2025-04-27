import { Especialidad } from "../interface/Especialidad.interface";
import { UsuarioResponse } from "../interface/Usuario/Usuario.interface";

export interface MedicoDTO {
    idUsuario: number;
    usuario: UsuarioResponse;
    especialidad: Especialidad;
}