import { Usuario } from "./Usuario.interface";

export interface MedicoConUsuario {
    usuario: Usuario;               // Datos del usuario (nombre, email, etc.)
    especialidad_id: number;        // FK: Especialidad
  }
  