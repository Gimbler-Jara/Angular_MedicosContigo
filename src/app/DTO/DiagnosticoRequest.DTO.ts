import { MedicamentoInputDTO } from "./MedicamentoInput.DTO";

export interface DiagnosticoRequestDTO {
  diagnostico: string;
  medicamentos: MedicamentoInputDTO[];
}