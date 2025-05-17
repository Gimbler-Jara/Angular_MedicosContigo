export const TABS: Record<'medico' | 'paciente' | 'admin', { key: string; label: string }[]> = {
    medico: [
        { key: 'registrar', label: 'Registrar médico' },
        { key: 'listar', label: 'Listar médicos' }
    ],
    paciente: [
        { key: 'registrar', label: 'Registrar paciente' },
        { key: 'listar', label: 'Listar pacientes' }
    ],
    admin: [
        { key: 'registrar', label: 'Registrar admin' },
        { key: 'listar', label: 'Listar admins' }
    ]
};
