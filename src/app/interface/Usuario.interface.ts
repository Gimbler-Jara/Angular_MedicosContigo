export interface Usuario {
    id: number;
    document_type: number; // FK: DocumentType
    dni: string;
    last_name: string;
    middle_name?: string;
    first_name: string;
    birth_date: string; // Use Date if parsing
    gender: 'M' | 'F';
    telefono?: string;
    email?: string;
    password_hash: string;
    rol_id: number; // FK: Rol
}
