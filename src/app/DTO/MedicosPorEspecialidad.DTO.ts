export interface MedicosPorEspecialidad {
    httpStatus: number;
    mensaje: string;
    medicos: MedicosPorEspecialidadDTO[]
}

export interface MedicosPorEspecialidadDTO {
    id: number,
    medico: string
}