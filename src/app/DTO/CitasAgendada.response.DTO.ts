export interface CitasAgendadasResponseDTO {
    id: number,
    fecha: string,
    hora: string,
    estado: string,
    pacienteID: number,
    pacienteNombre: string,
    medicoId: number,
    medicoNombre: string;
    Especialidad: string;
    tipo_cita: number;
} 