import { DisponibilidadCitaPorMedicoDTO } from "./DisponibilidadCitaPorMedico.DTO";

export interface DisponibilidadesResponse {
  httpStatus: number;
  mensaje: string;
  datos: DisponibilidadCitaPorMedicoDTO[];
}
