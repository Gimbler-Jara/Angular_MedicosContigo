export interface PacienteActualizacionDTO {
    idUsuario: number;
    firstName: string;
    middleName?: string;
    lastName: string;
    telefono?: string;
    birthDate?: string;        
    gender?: string;          
    dni?: string;
    email?: string;
    password?: string;         
    documentTypeId?: number;
}