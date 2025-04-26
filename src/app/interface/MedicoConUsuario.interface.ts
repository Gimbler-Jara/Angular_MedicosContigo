import { UsuarioRequest } from "./Usuario/Usuario.interface";

export interface MedicoConUsuario {
    usuario: UsuarioRequest;               // Datos del usuario (nombre, email, etc.)
    especialidad_id: number;        // FK: Especialidad
  }
  