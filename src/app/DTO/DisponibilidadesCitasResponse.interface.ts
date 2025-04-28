import { DisponibilidadCitaPorMedicoDTO } from "./DisponibilidadCitaPorMedico.interface";

export interface DisponibilidadesResponse {
    data: DisponibilidadCitaPorMedicoDTO[];
    success: boolean;
    message: string;
  }
  