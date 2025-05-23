export interface HorasDispiniblesDTO {
    httpStatus: number;
    mensaje: string;
    horas: HorasDispinibles[]
}


export interface HorasDispinibles {
    id: number,
    hora: string
}


