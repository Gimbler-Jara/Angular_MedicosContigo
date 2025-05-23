import { Document_Type } from "../DocumentType.interface";
import { Rol } from "../Rol.interface";

export interface UsiarioPacienteResponse {
    httpStatus: number;
    mensaje: string;
    paciente: UsuarioPacienteRequest;
}

export interface UsuarioPacienteRequest {
    id?: number;
    documentTypeId: number;
    dni: string;
    lastName: string;
    middleName?: string;
    firstName: string;
    birthDate: string;
    gender: 'M' | 'F';
    telefono?: string;
    email?: string;
    password: string;
}

export interface UsuarioMedicoRequest {
    id?: number;
    documentTypeId: number;
    dni: string;
    lastName: string;
    middleName?: string;
    firstName: string;
    birthDate: string;
    gender: 'M' | 'F';
    telefono?: string;
    email?: string;
    password: string;
    especialidadId: number
}

export interface PerfilResponse {
    httpStatus: number,
    mensaje: string,
    usuario: UsuarioResponse
}



export interface UsuarioResponse {
    id?: number;
    documentType: Document_Type;
    dni: string;
    lastName: string;
    middleName?: string;
    firstName: string;
    birthDate: string;
    gender: 'M' | 'F';
    telefono?: string;
    email?: string;
    passwordHash: string;
    rol: Rol;
    activo?: boolean;

}