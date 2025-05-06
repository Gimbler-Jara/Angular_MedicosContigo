export function obtenerProximaFecha(diaSemana: string): string {
    const dias = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
    const dia = diaSemana.trim().toLowerCase();

    const hoy = new Date(); 
    hoy.setHours(12, 0, 0, 0); // evita desfases por zona horaria

    const diaActual = hoy.getDay(); 
    const diaActualAjustado = (diaActual + 6) % 7; // Ajuste para que lunes sea 0, martes 1, ..., domingo 6

    const objetivo = dias.indexOf(dia);
    if (objetivo === -1) throw new Error(`Día inválido: ${diaSemana}`);

    let diasParaSumar = objetivo - diaActualAjustado;
    if (diasParaSumar <= 0) diasParaSumar += 7;

    const proximaFecha = new Date(hoy);
    proximaFecha.setDate(hoy.getDate() + diasParaSumar);

    return proximaFecha.toISOString().split('T')[0]; // Formato YYYY-MM-DD
}

