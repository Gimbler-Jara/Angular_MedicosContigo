export interface CitasReservadasPorPacienteResponseDTO {
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