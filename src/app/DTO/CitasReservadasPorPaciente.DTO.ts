export interface CitasReservadasPorPacienteResponseDTO {
    httpStatus: number;
    mensaje: string;
    citas: CitasReservadasPorPacienteResponse[];
}

export interface CitasReservadasPorPacienteResponse {
    id?: number,
    fecha: string,
    idHora: number,
    estado: string,
    idMedico: number,
    medico: string,
    especialidad: string,
    tipo_cita: number,
    nombre_sala: string
}