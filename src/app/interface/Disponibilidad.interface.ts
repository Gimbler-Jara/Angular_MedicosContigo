export interface Disponibilidad {
    id: number;
    idMedico: number; // FK: Usuario
    idDiaSemana: number; // FK: DiaSemana
    idHora: number; // FK: Hora
    especialidad_id: number; // FK: Especialidad
    activo: boolean;
  }
  