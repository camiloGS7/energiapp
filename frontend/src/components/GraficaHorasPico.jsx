import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Cell, ResponsiveContainer,
} from 'recharts'
import { calcularConsumoHorario } from '../utils/horasPico'

const COLOR_PICO   = '#EF4444'
const COLOR_NORMAL = '#0071e3'

function TooltipHora({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: '6px',
      padding: '6px 10px',
      fontSize: '0.8rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    }}>
      <div style={{ fontWeight: 600, color: '#1f2937' }}>{label}</div>
      <div style={{ color: '#6b7280' }}>
        {Number(payload[0].value).toFixed(1)} kWh
      </div>
    </div>
  )
}

export default function GraficaHorasPico({ totalKwh }) {
  const datos = calcularConsumoHorario(totalKwh)

  return (
    <div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={datos} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f5" vertical={false} />
          <XAxis
            dataKey="hora"
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
            interval={2}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<TooltipHora />} cursor={{ fill: 'rgba(0,113,227,0.05)' }} />
          <Bar dataKey="kwh" radius={[3, 3, 0, 0]}>
            {datos.map((d, i) => (
              <Cell key={i} fill={d.esPico ? COLOR_PICO : COLOR_NORMAL} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div style={{
        display: 'flex',
        gap: '1.25rem',
        justifyContent: 'center',
        marginTop: '0.75rem',
        fontSize: '0.75rem',
        color: '#6b7280',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: COLOR_PICO,
            display: 'inline-block',
          }} />
          <span>Hora pico</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: COLOR_NORMAL,
            display: 'inline-block',
          }} />
          <span>Consumo normal</span>
        </div>
      </div>
    </div>
  )
}
