import { useState, useEffect } from 'react'
import { Lightbulb, Thermometer, Plug, Clock, BarChart2, Sun } from 'lucide-react'
import recomendaciones from '../data/recomendaciones'

const ICONOS = {
  'lightbulb':  Lightbulb,
  'thermometer': Thermometer,
  'plug':       Plug,
  'clock':      Clock,
  'bar-chart':  BarChart2,
  'sun':        Sun,
}

export default function Recomendaciones({ totalKwh }) {
  const filtradas = recomendaciones.filter(r => r.umbral <= totalKwh)
  const lista = filtradas.length > 0
    ? filtradas
    : recomendaciones.filter(r => r.umbral === 0)

  const [indiceActual, setIndiceActual] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const intervalo = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndiceActual(prev => (prev + 1) % lista.length)
        setVisible(true)
      }, 500)
    }, 4000)
    return () => clearInterval(intervalo)
  }, [lista.length])

  const actual = lista[indiceActual] ?? lista[0]
  const Icono = ICONOS[actual.icono]

  return (
    <div
      style={{
        background: '#f8fafc',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '1.5rem',
        minHeight: '130px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '1.25rem',
      }}
    >
      <div
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          {Icono && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#e8f0fd',
                flexShrink: 0,
              }}
            >
              <Icono size={17} strokeWidth={1.75} color="#0071e3" />
            </div>
          )}
          <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#1f2937' }}>
            {actual.titulo}
          </span>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: 0, lineHeight: 1.55 }}>
          {actual.texto}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '6px' }}>
        {lista.map((_, i) => (
          <span
            key={i}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: i === indiceActual ? '#0071e3' : '#d1d5db',
              display: 'inline-block',
              transition: 'background 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  )
}
