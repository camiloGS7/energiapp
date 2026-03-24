import { Zap } from 'lucide-react'
import styles from './Auth.module.css'

function EnergyWaveSVG() {
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      viewBox="0 0 480 900"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* Grid tenue */}
      <line x1="0"   y1="225" x2="480" y2="225" stroke="#0071e3" strokeWidth="0.5" opacity="0.07" />
      <line x1="0"   y1="450" x2="480" y2="450" stroke="#0071e3" strokeWidth="0.5" opacity="0.07" />
      <line x1="0"   y1="675" x2="480" y2="675" stroke="#0071e3" strokeWidth="0.5" opacity="0.07" />
      <line x1="120" y1="0"   x2="120" y2="900" stroke="#0071e3" strokeWidth="0.5" opacity="0.05" />
      <line x1="240" y1="0"   x2="240" y2="900" stroke="#0071e3" strokeWidth="0.5" opacity="0.05" />
      <line x1="360" y1="0"   x2="360" y2="900" stroke="#0071e3" strokeWidth="0.5" opacity="0.05" />

      {/* Onda sinusoidal superior */}
      <path
        d="M-60 280 C30 160, 150 400, 240 280 C330 160, 450 400, 540 280 C630 160, 750 400, 840 280"
        stroke="#0071e3" strokeWidth="1.5" opacity="0.28"
      />
      {/* Segunda onda más tenue */}
      <path
        d="M-60 340 C30 220, 150 460, 240 340 C330 220, 450 460, 540 340 C630 220, 750 460, 840 340"
        stroke="#0071e3" strokeWidth="0.75" opacity="0.12"
      />

      {/* Onda ECG / pulso eléctrico */}
      <path
        d="M-40 680 L110 680 L145 590 L168 770 L192 680 L300 680 L335 610 L358 750 L382 680 L560 680"
        stroke="#0071e3" strokeWidth="1.75" opacity="0.3"
        strokeLinecap="round" strokeLinejoin="round"
      />

      {/* Nodos de intersección */}
      <circle cx="240" cy="280" r="3"   fill="#0071e3" opacity="0.45" />
      <circle cx="540" cy="280" r="2.5" fill="#0071e3" opacity="0.3"  />
      <circle cx="192" cy="680" r="3.5" fill="#0071e3" opacity="0.45" />
      <circle cx="382" cy="680" r="3"   fill="#0071e3" opacity="0.3"  />

      {/* Líneas de circuito en esquina superior derecha */}
      <path
        d="M360 60 L400 60 L400 120 L440 120"
        stroke="#0071e3" strokeWidth="1" opacity="0.18"
        strokeLinecap="round" strokeLinejoin="round"
      />
      <circle cx="400" cy="90"  r="2" fill="#0071e3" opacity="0.2" />
      <circle cx="440" cy="120" r="2" fill="#0071e3" opacity="0.2" />
    </svg>
  )
}

export default function AuthLayout({ panelTitle, panelSubtitle, children }) {
  return (
    <div className={styles.page}>
      {/* Panel izquierdo oscuro */}
      <div className={styles.panelLeft}>
        <EnergyWaveSVG />
        <div className={styles.panelLogo}>
          <Zap size={16} strokeWidth={2.5} />
          EnergiApp
        </div>
        <div className={styles.panelContent}>
          <p className={styles.panelEyebrow}>Plataforma de monitoreo energético</p>
          <h2 className={styles.panelTitle}>{panelTitle}</h2>
          <p className={styles.panelSubtitle}>{panelSubtitle}</p>
        </div>
      </div>

      {/* Panel derecho blanco */}
      <div className={styles.panelRight}>
        <div className={styles.formWrap}>
          {children}
        </div>
      </div>
    </div>
  )
}
