import { UsuarioPacienteRequest } from "./Usuario/Usuario.interface";

export interface MedicoConUsuario {
    usuario: UsuarioPacienteRequest;               // Datos del usuario (nombre, email, etc.)
    especialidad_id: number;        // FK: Especialidad
  }
  