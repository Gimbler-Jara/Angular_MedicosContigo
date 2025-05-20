export interface AgendarCitaMedicaDTO {
    id?: number;
    idMedico: number;
    idPaciente: number;
    fecha: string;
    idHora: number;
    estado: number;
    tipoCita: number;
    nombreSala: string;
}
