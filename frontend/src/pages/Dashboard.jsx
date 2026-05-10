import { useState, useEffect } from 'react'
import { Zap, DollarSign, Wind, Activity, TrendingUp, TrendingDown } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import {
  AreaChart, Area, BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useAuth } from '../context/AuthContext'
import { dashboardService } from '../services/api'
import styles from './Dashboard.module.css'

// ── Datos estáticos ──────────────────────────────────────────────

const BAR_COLORS = ['#0071e3', '#2388f0', '#4a9ff5', '#7abcf8']

const READINGS = [
  { date: '24 Mar, 14:32', device: 'Panel Principal',      kwh: 12.4, status: 'Activo'   },
  { date: '24 Mar, 14:15', device: 'Climatización Zona A', kwh:  8.7, status: 'Activo'   },
  { date: '24 Mar, 13:58', device: 'Iluminación Oficinas', kwh:  3.2, status: 'Alerta'   },
  { date: '24 Mar, 13:45', device: 'Compresor Industrial', kwh: 18.9, status: 'Activo'   },
  { date: '24 Mar, 12:30', device: 'Servidor Sala TI',     kwh:  0.0, status: 'Inactivo' },
]

const ROLE_LABELS = {
  comercio:  'Comercio',
  cliente:   'Cliente',
  fundacion: 'Fundación',
}

// ── Componentes auxiliares ────────────────────────────────────────

function MetricCard({ label, value, unit, change, Icon, good, invert }) {
  const isPositive = change > 0
  const isGoodNews = invert ? !isPositive : (good ? isPositive : !isPositive)

  return (
    <div className={styles.metricCard}>
      <div className={styles.metricHeader}>
        <span className={styles.metricLabel}>{label}</span>
        <div className={styles.metricIconWrap}>
          <Icon size={15} strokeWidth={2.25} />
        </div>
      </div>

      <div className={styles.metricValue}>
        {value}
        <span className={styles.metricUnit}>{unit}</span>
      </div>

      <div className={`${styles.metricChange} ${isGoodNews ? styles.changeGood : styles.changeBad}`}>
        {isPositive
          ? <TrendingUp  size={13} strokeWidth={2.5} />
          : <TrendingDown size={13} strokeWidth={2.5} />}
        <span>{Math.abs(change)}% vs mes anterior</span>
      </div>
    </div>
  )
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{label}</p>
      <p className={styles.tooltipValue}>{Number(payload[0].value).toFixed(1)} kWh</p>
    </div>
  )
}

// ── Componente principal ─────────────────────────────────────────

export default function Dashboard() {
  const { user } = useAuth()

  const [consumoData,    setConsumoData]    = useState(null)
  const [loadingConsumo, setLoadingConsumo] = useState(true)
  const [errorConsumo,   setErrorConsumo]   = useState(null)

  useEffect(() => {
    dashboardService.getConsumo()
      .then(res => {
        setConsumoData(res.data)
        setLoadingConsumo(false)
      })
      .catch(err => {
        console.error('Error cargando dashboard:', err)
        setErrorConsumo('No se pudieron cargar los datos')
        setLoadingConsumo(false)
      })
  }, [])

  const roleLabel = ROLE_LABELS[user?.role] ?? user?.role

  const METRICS = [
    {
      label:  'Consumo Actual',
      value:  consumoData ? consumoData.total.toFixed(1) : '...',
      unit:   'kWh',
      change: +12,
      Icon:   Zap,
      good:   false,
    },
    {
      label:  'Ahorro Generado',
      value:  '$127.400',
      unit:   'COP',
      change: -3,
      Icon:   DollarSign,
      good:   true,
    },
    {
      label:  'Emisiones CO₂',
      value:  '142',
      unit:   'kg',
      change: -8,
      Icon:   Wind,
      good:   false,
      invert: true,
    },
    {
      label:  'Eficiencia',
      value:  '87',
      unit:   '%',
      change: +5,
      Icon:   Activity,
      good:   true,
    },
  ]

  const weeklyData = consumoData
    ? consumoData.labels.map((label, i) => ({
        day: label.slice(5),
        kwh: consumoData.series.reduce(
          (sum, s) => sum + (s.data[i] ?? 0), 0
        )
      }))
    : []

  const areaData = consumoData
    ? consumoData.series.map(s => ({
        area: s.nombre,
        kwh: parseFloat(
          s.data.reduce((sum, v) => sum + (v ?? 0), 0).toFixed(1)
        )
      }))
    : []

  return (
    <div className={styles.layout}>
      <Sidebar activePage="dashboard" />

      <main className={styles.main}>
        {/* Topbar */}
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <h1>Hola, {user?.name?.split(' ')[0]}</h1>
            <p>
              {new Date().toLocaleDateString('es', {
                weekday: 'long', year: 'numeric',
                month: 'long', day: 'numeric',
              })}
            </p>
          </div>
          <span className={styles.roleBadge}>{roleLabel}</span>
        </header>

        <div className={styles.content}>

          {/* ── Sección: Métricas ── */}
          <div className={styles.sectionRow}>
            <h2 className={styles.sectionTitle}>Resumen del período</h2>
            <span className={styles.sectionMeta}>Últimos 30 días</span>
          </div>

          <div className={styles.metricsGrid}>
            {METRICS.map((m) => (
              <MetricCard key={m.label} {...m} />
            ))}
          </div>

          {/* ── Sección: Gráficas ── */}
          {loadingConsumo && (
            <div className={styles.chartCard} style={{ padding: '2rem', textAlign: 'center' }}>
              <p style={{ color: '#9ca3af' }}>Cargando datos...</p>
            </div>
          )}

          {errorConsumo && (
            <div className={styles.chartCard} style={{ padding: '2rem', textAlign: 'center' }}>
              <p style={{ color: '#ef4444' }}>{errorConsumo}</p>
            </div>
          )}

          {!loadingConsumo && !errorConsumo && consumoData && (
            <div className={styles.chartsGrid}>
              {/* Gráfica 1 — Consumo 30 días */}
              <div className={styles.chartCard}>
                <p className={styles.chartTitle}>Consumo energético — Últimos 30 días</p>
                <div className={styles.chartBody}>
                  <ResponsiveContainer width="100%" height={248}>
                    <AreaChart
                      data={weeklyData}
                      margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%"   stopColor="#0071e3" stopOpacity={0.18} />
                          <stop offset="100%" stopColor="#0071e3" stopOpacity={0}    />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f5" vertical={false} />
                      <XAxis
                        dataKey="day"
                        tick={{ fontSize: 12, fill: '#9ca3af' }}
                        axisLine={false} tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: '#9ca3af' }}
                        axisLine={false} tickLine={false}
                        tickFormatter={(v) => `${v}`}
                      />
                      <Tooltip content={<ChartTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="kwh"
                        stroke="#0071e3"
                        strokeWidth={2}
                        fill="url(#areaGrad)"
                        dot={false}
                        activeDot={{ r: 4, fill: '#0071e3', strokeWidth: 0 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Gráfica 2 — Consumo por dispositivo */}
              <div className={styles.chartCard}>
                <p className={styles.chartTitle}>Consumo por dispositivo</p>
                <div className={styles.chartBody}>
                  <ResponsiveContainer width="100%" height={248}>
                    <BarChart
                      data={areaData}
                      margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f5" vertical={false} />
                      <XAxis
                        dataKey="area"
                        tick={{ fontSize: 11, fill: '#9ca3af' }}
                        axisLine={false} tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: '#9ca3af' }}
                        axisLine={false} tickLine={false}
                      />
                      <Tooltip content={<ChartTooltip />} />
                      <Bar dataKey="kwh" radius={[5, 5, 0, 0]} maxBarSize={52}>
                        {areaData.map((_, i) => (
                          <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* ── Sección: Tabla ── */}
          <div className={styles.tableCard}>
            <div className={styles.tableCardHeader}>
              <p className={styles.chartTitle}>Últimas lecturas</p>
            </div>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Dispositivo</th>
                    <th>Consumo</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {READINGS.map((r, i) => (
                    <tr key={i}>
                      <td>{r.date}</td>
                      <td>{r.device}</td>
                      <td className={styles.tdMono}>{r.kwh.toFixed(1)} kWh</td>
                      <td>
                        <span
                          className={styles.statusBadge}
                          data-status={r.status.toLowerCase()}
                        >
                          <span className={styles.statusDot} />
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
