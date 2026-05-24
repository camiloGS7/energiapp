// Distribución horaria típica de consumo energético residencial/comercial
// Los porcentajes suman 1.0 (100%)
const PATRONES_HORARIOS = [
  0.01, 0.01, 0.01, 0.01, 0.01, 0.02, // 0h-5h  madrugada
  0.05, 0.06, 0.06, 0.05, 0.04, 0.04, // 6h-11h mañana
  0.07, 0.07, 0.06, 0.05, 0.05, 0.05, // 12h-17h mediodía/tarde
  0.06, 0.07, 0.06, 0.05, 0.03, 0.01  // 18h-23h noche
]

// Umbral para considerar una hora como "pico"
// Una hora es pico si su patrón >= 0.06 (6% del consumo diario)
const UMBRAL_PICO = 0.06

export function calcularConsumoHorario(totalKwh) {
  return PATRONES_HORARIOS.map((patron, hora) => ({
    hora: `${String(hora).padStart(2, '0')}:00`,
    kwh: parseFloat((totalKwh * patron).toFixed(1)),
    esPico: patron >= UMBRAL_PICO,
  }))
}

export function obtenerHorasPico() {
  return PATRONES_HORARIOS
    .map((patron, hora) => ({ hora, patron }))
    .filter(h => h.patron >= UMBRAL_PICO)
    .map(h => `${String(h.hora).padStart(2, '0')}:00`)
}

export function calcularAlerta(totalKwh) {
  // Umbral: más de 2000 kWh en el período muestra alerta de consumo alto
  const nivelAlto = totalKwh > 4000
  const nivelMedio = totalKwh > 2000 && totalKwh <= 4000
  return {
    mostrar: totalKwh > 2000,
    nivel: nivelAlto ? 'alto' : nivelMedio ? 'medio' : 'normal',
    color: nivelAlto ? '#EF4444' : '#F59E0B',
    fondo: nivelAlto ? '#FEF2F2' : '#FFFBEB',
    borde: nivelAlto ? '#FCA5A5' : '#FCD34D',
  }
}
