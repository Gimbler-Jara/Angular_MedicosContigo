export interface EstructuraDisponibilidadCitaResponse<T = any> {
    httpStatus:number;
    mensaje: string;
    data?: T;
    errors?: string[];
}
