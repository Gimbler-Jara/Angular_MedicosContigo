import { Especialidad } from "../interface/Especialidad.interface";
import { UsuarioResponse } from "../interface/Usuario/Usuario.interface";

export interface MedicoResponse {
    httpStatus: number;
    mensaje: string;
    medicos: MedicoDTO[]
}

export interface MedicoPorIdResponse {
    httpStatus: number;
    mensaje: string;
    medico: MedicoDTO;
}


export interface MedicoDTO {
    idUsuario: number;
    usuario: UsuarioResponse;
    especialidad: Especialidad;
    urlFirmaDigital: string;
    cmp: string;
}