export interface DetalleCitaAtendidaDTO {
  idCita: number;
  paciente: string;
  medico: string;
  fecha: string;      // formato ISO: "2025-05-12"
  hora: string;       // ejemplo: "09:00"
  diagnostico: string;
  receta: string;   // cada medicamento como string
}
