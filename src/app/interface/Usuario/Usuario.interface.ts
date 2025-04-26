import { Rol } from "../Rol.interface";

export interface UsuarioRequest {
    id?: number;
    document_type: number; 
    dni: string;
    lastName: string;
    middleName?: string;
    firstName: string;
    birthDate: string; 
    gender: 'M' | 'F';
    telefono?: string;
    email?: string;
    passwordHash: string;
    rol_id: number; 
}


export interface UsuarioResponse {
    id?: number;
    document_type: DocumentType; 
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
}