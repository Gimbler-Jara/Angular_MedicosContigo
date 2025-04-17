export interface CitaMedica {
    id: number;
    id_medico: number; // FK: Medico
    id_paciente: number; // FK: Paciente
    fecha: string; // Use Date if parsing
    idHora: number; // FK: Hora
    estado: number; // FK: EstadoCita
}
