import { DisponibilidadCitaPorMedicoDTO } from "./DisponibilidadCitaPorMedico.DTO";

export interface DisponibilidadesResponse {
    data: DisponibilidadCitaPorMedicoDTO[];
    success: boolean;
    message: string;
  }
  