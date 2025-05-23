export interface DocumentResponse {
    httpstatus: number,
    mensaje: string,
    documentos: Document_Type[]
}


export interface Document_Type {
    id: number;
    doc: string;
}

