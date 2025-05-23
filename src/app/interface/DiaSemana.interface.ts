export interface DiaSemanaResponse {
  httpstatus: number,
  mensaje: string,
  diasSemana: DiaSemana[]
}

export interface DiaSemana {
    id: number;
    dia: string;
}
