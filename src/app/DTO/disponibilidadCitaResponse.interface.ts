export interface EstructuraDisponibilidadCitaResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    errors?: string[];
}
