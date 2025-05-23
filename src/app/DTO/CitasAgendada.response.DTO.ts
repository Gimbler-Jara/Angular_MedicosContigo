export interface CitasAgendadasResponseDTO {
    httpStatus: number;
    mensaje: string;
    citas: CitasAgendadasResponse[];
}

export interface CitasAgendadasResponse {
    id: number,
    fecha: string,
    hora: string,
    estado: string,
    pacienteId: number,
    pacienteNombre: string,
    medicoId: number,
    medicoNombre: string;
    Especialidad: string;
    tipo_cita: number;
    nombre_sala: string;
} 