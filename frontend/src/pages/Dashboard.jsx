import { useNavigate } from 'react-router-dom'
import { Zap, DollarSign, Wind, Activity, TrendingUp, TrendingDown } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import {
  AreaChart, Area, BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useAuth } from '../context/AuthContext'
import styles from './Dashboard.module.css'

// ── Datos simulados ──────────────────────────────────────────────

const METRICS = [
  {
    label:  'Consumo Actual',
    value:  '284',
    unit:   'kWh',
    change: +12,
    Icon:   Zap,
    good:   false,   // subir consumo es malo
  },
  {
    label:  'Ahorro Generado',
    value:  '$127.400',
    unit:   'COP',
    change: -3,
    Icon:   DollarSign,
    good:   true,    // bajar ahorro es malo
  },
  {
    label:  'Emisiones CO₂',
    value:  '142',
    unit:   'kg',
    change: -8,
    Icon:   Wind,
    good:   false,   // bajar CO₂ es bueno → lógica invertida
    invert: true,
  },
  {
    label:  'Eficiencia',
    value:  '87',
    unit:   '%',
    change: +5,
    Icon:   Activity,
    good:   true,    // subir eficiencia es bueno
  },
]

const WEEKLY_DATA = [
  { day: 'Lun', kwh: 38.4 },
  { day: 'Mar', kwh: 42.1 },
  { day: 'Mié', kwh: 39.7 },
  { day: 'Jue', kwh: 45.2 },
  { day: 'Vie', kwh: 51.8 },
  { day: 'Sáb', kwh: 32.6 },
  { day: 'Dom', kwh: 34.2 },
]

const AREA_DATA = [
  { area: 'Iluminación',   kwh: 68 },
  { area: 'Climatización', kwh: 95 },
  { area: 'Equipos',       kwh: 72 },
  { area: 'Producción',    kwh: 49 },
]

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
  // ¿El cambio es buena noticia?
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
      <p className={styles.tooltipValue}>{payload[0].value} kWh</p>
    </div>
  )
}

// ── Componente principal ─────────────────────────────────────────

export default function Dashboard() {
  const { user } = useAuth()

  const roleLabel = ROLE_LABELS[user?.role] ?? user?.role

  return (
    <div className={styles.layout}>
      <Sidebar activePage="dashboard" />

      {/* ── Main ── */}
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

        {/* Contenido */}
        <div className={styles.content}>

          {/* ── Sección: Métricas ── */}
          <div className={styles.sectionRow}>
            <h2 className={styles.sectionTitle}>Resumen del período</h2>
            <span className={styles.sectionMeta}>Marzo 2026</span>
          </div>

          <div className={styles.metricsGrid}>
            {METRICS.map((m) => (
              <MetricCard key={m.label} {...m} />
            ))}
          </div>

          {/* ── Sección: Gráficas ── */}
          <div className={styles.chartsGrid}>
            {/* Gráfica 1 — Consumo semanal */}
            <div className={styles.chartCard}>
              <p className={styles.chartTitle}>Consumo energético — Últimos 7 días</p>
              <div className={styles.chartBody}>
                <ResponsiveContainer width="100%" height={248}>
                  <AreaChart
                    data={WEEKLY_DATA}
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

            {/* Gráfica 2 — Distribución por área */}
            <div className={styles.chartCard}>
              <p className={styles.chartTitle}>Distribución por área</p>
              <div className={styles.chartBody}>
                <ResponsiveContainer width="100%" height={248}>
                  <BarChart
                    data={AREA_DATA}
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
                      {AREA_DATA.map((_, i) => (
                        <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

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
