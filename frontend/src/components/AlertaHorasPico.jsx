import { AlertTriangle, BarChart2 } from 'lucide-react'
import { calcularAlerta, obtenerHorasPico } from '../utils/horasPico'

export default function AlertaHorasPico({ totalKwh }) {
  const alerta = calcularAlerta(totalKwh)

  if (!alerta.mostrar) return null

  const Icono   = alerta.nivel === 'alto' ? AlertTriangle : BarChart2
  const titulo  = alerta.nivel === 'alto'
    ? 'Consumo elevado detectado'
    : 'Consumo moderado-alto'

  return (
    <div
      style={{
        background:    alerta.fondo,
        border:        `1px solid ${alerta.borde}`,
        borderRadius:  '8px',
        padding:       '0.75rem 1rem',
        marginBottom:  '1rem',
        display:       'flex',
        alignItems:    'center',
        gap:           '0.75rem',
      }}
    >
      <div
        style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          width:          '34px',
          height:         '34px',
          borderRadius:   '8px',
          background:     '#ffffff',
          border:         `1px solid ${alerta.borde}`,
          flexShrink:     0,
        }}
      >
        <Icono size={18} strokeWidth={2} color={alerta.color} />
      </div>
      <div>
        <div style={{ fontWeight: 700, color: alerta.color, fontSize: '0.9rem' }}>
          {titulo}
        </div>
        <div style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '2px' }}>
          Las horas de mayor consumo son: {obtenerHorasPico().join(', ')}.
          Considera mover cargas eléctricas a la madrugada (00:00-05:00).
        </div>
      </div>
    </div>
  )
}
