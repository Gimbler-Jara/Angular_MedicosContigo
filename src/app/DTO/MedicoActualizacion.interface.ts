export interface MedicoActualizacionDTO {
  idUsuario: number;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  telefono?: string;
  birthDate?: string; // Asegúrate que sea string en formato YYYY-MM-DD
  gender?: string;
  dni?: string;
  email?: string;
  password?: string;
  documentTypeId?: number;
  especialidadId?: number;
}
