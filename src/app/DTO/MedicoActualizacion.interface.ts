export interface MedicoActualizacionDTO {
    idUsuario: number;
    firstName: string;
    middleName?: string;
    lastName: string;
    telefono?: string;
    birthDate: string;  // formato 'YYYY-MM-DD'
    gender: string;
    especialidadId?: number;
  }
  