// fecha.utils.ts

export function obtenerProximaFecha(diaSemana: string): string {
    const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const dia = diaSemana.trim().toLowerCase();
    const hoy = new Date();
    const diaActual = hoy.getDay(); // 0=domingo, 1=lunes, ...
    const objetivo = dias.indexOf(dia);

    if (objetivo === -1) {
        throw new Error(`Día de la semana no válido: ${diaSemana}`);
    }

    // Calcula cuántos días hay que sumar para el próximo objetivo
    let diasParaSumar = objetivo - diaActual;
    if (diasParaSumar <= 0) diasParaSumar += 7;

    const proximaFecha = new Date(hoy);
    proximaFecha.setDate(hoy.getDate() + diasParaSumar);

    // Formatea a 'YYYY-MM-DD'
    return proximaFecha.toISOString().split('T')[0];
}
