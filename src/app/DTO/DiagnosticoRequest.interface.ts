import { MedicamentoInputDTO } from "./MedicamentoInput.interface";

export interface DiagnosticoRequestDTO {
  diagnostico: string;
  medicamentos: MedicamentoInputDTO[];
}