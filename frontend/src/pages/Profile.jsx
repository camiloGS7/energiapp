import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { userService } from '../services/api'
import Sidebar from '../components/Sidebar'
import styles from './Profile.module.css'

const ROLE_LABELS = {
  comercio:  'Comercio',
  cliente:   'Cliente',
  fundacion: 'Fundación',
}

function getInitials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('') || '?'
}

function formatMemberSince(created_at) {
  if (!created_at) return 'Marzo 2026'
  return new Date(created_at).toLocaleDateString('es', { month: 'long', year: 'numeric' })
}

// ── Toggle accesible ─────────────────────────────────────────────
function Toggle({ label, checked, onChange }) {
  return (
    <div className={styles.toggleRow}>
      <span className={styles.toggleLabel}>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={`${styles.toggle} ${checked ? styles.toggleOn : ''}`}
        onClick={() => onChange(!checked)}
      >
        <span className={styles.toggleThumb} />
      </button>
    </div>
  )
}

// ── Preferencias según rol ────────────────────────────────────────
function PreferencesSection({ role, prefs, setPrefs }) {
  const set = (key) => (e) => setPrefs((p) => ({ ...p, [key]: e.target.value }))
  const toggle = (key) => (val) => setPrefs((p) => ({ ...p, [key]: val }))

  if (role === 'cliente') return (
    <>
      <div className={styles.field}>
        <label htmlFor="address">Dirección</label>
        <input id="address" type="text" placeholder="Calle 123 # 45-67, Bogotá" value={prefs.address} onChange={set('address')} />
      </div>
      <Toggle label="Recibir notificaciones por email" checked={prefs.emailNotif} onChange={toggle('emailNotif')} />
      <Toggle label="Alertas de consumo elevado" checked={prefs.consumptionAlerts} onChange={toggle('consumptionAlerts')} />
    </>
  )

  if (role === 'comercio') return (
    <>
      <div className={styles.field}>
        <label htmlFor="businessName">Nombre del establecimiento</label>
        <input id="businessName" type="text" placeholder="Mi Negocio S.A.S." value={prefs.businessName} onChange={set('businessName')} />
      </div>
      <div className={styles.formRow}>
        <div className={styles.field}>
          <label htmlFor="nit">NIT</label>
          <input id="nit" type="text" placeholder="900.123.456-7" value={prefs.nit} onChange={set('nit')} />
        </div>
        <div className={styles.field}>
          <label htmlFor="schedule">Horario de atención</label>
          <input id="schedule" type="text" placeholder="Lun-Vie 8:00-18:00" value={prefs.schedule} onChange={set('schedule')} />
        </div>
      </div>
    </>
  )

  if (role === 'fundacion') return (
    <>
      <div className={styles.field}>
        <label htmlFor="entityName">Nombre de la entidad</label>
        <input id="entityName" type="text" placeholder="Fundación Energía Verde" value={prefs.entityName} onChange={set('entityName')} />
      </div>
      <div className={styles.field}>
        <label htmlFor="capacity">Capacidad de recepción (kWh/mes)</label>
        <input id="capacity" type="number" placeholder="5000" value={prefs.capacity} onChange={set('capacity')} />
      </div>
    </>
  )

  return null
}

// ── Componente principal ─────────────────────────────────────────
export default function Profile() {
  const { user, updateUser } = useAuth()

  const [personal, setPersonal] = useState({
    name:  user?.name  || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })

  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
  })

  const [prefs, setPrefs] = useState({
    address:          '',
    emailNotif:       true,
    consumptionAlerts: false,
    businessName:     '',
    nit:              '',
    schedule:         '',
    entityName:       '',
    capacity:         '',
  })

  const [saving,  setSaving]  = useState(false)
  const [success, setSuccess] = useState(false)
  const [error,   setError]   = useState('')

  const roleLabel = ROLE_LABELS[user?.role] ?? user?.role

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setSuccess(false)
    setError('')
    try {
      const { data } = await userService.updateProfile(personal)
      updateUser(data.user)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 4000)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar los cambios')
    } finally {
      setSaving(false)
    }
  }

  function handlePasswordSubmit(e) {
    e.preventDefault()
    // Solo visual por ahora
    setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  return (
    <div className={styles.layout}>
      <Sidebar activePage="profile" />

      <main className={styles.main}>
        {/* Topbar */}
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <h1>Mi Perfil</h1>
            <p>Gestiona tu información personal y preferencias</p>
          </div>
          <span className={styles.roleBadge}>{roleLabel}</span>
        </header>

        <div className={styles.content}>
          <div className={styles.profileGrid}>

            {/* ── Columna izquierda: tarjeta de perfil ── */}
            <aside className={styles.profileCard}>
              <div className={styles.avatar}>
                {getInitials(user?.name)}
              </div>

              <h2 className={styles.cardName}>{user?.name}</h2>
              <p className={styles.cardEmail}>{user?.email}</p>
              <span className={styles.cardBadge}>{roleLabel}</span>

              <p className={styles.cardMeta}>
                Miembro desde {formatMemberSince(user?.created_at)}
              </p>

              <button type="button" className={styles.changePhotoBtn}>
                Cambiar foto
              </button>
            </aside>

            {/* ── Columna derecha: formularios ── */}
            <div className={styles.formCol}>

              {/* Sección 1 — Información personal */}
              <form className={styles.formSection} onSubmit={handleSave}>
                <h3 className={styles.sectionTitle}>Información personal</h3>
                <div className={styles.sectionDivider} />

                <div className={styles.formRow}>
                  <div className={styles.field}>
                    <label htmlFor="name">Nombre completo</label>
                    <input
                      id="name"
                      type="text"
                      value={personal.name}
                      onChange={(e) => setPersonal({ ...personal, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="email">Correo electrónico</label>
                    <input
                      id="email"
                      type="email"
                      value={personal.email}
                      onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className={styles.field} style={{ maxWidth: '320px' }}>
                  <label htmlFor="phone">Teléfono <span className={styles.optional}>(opcional)</span></label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+57 300 123 4567"
                    value={personal.phone}
                    onChange={(e) => setPersonal({ ...personal, phone: e.target.value })}
                  />
                </div>

                {error   && <p className={styles.errorMsg}>{error}</p>}
                {success && (
                  <p className={styles.successMsg}>
                    Perfil actualizado correctamente
                  </p>
                )}

                <div className={styles.saveBar}>
                  <button type="submit" className={styles.saveBtn} disabled={saving}>
                    {saving ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                </div>
              </form>

              {/* Sección 2 — Seguridad */}
              <form className={styles.formSection} onSubmit={handlePasswordSubmit}>
                <h3 className={styles.sectionTitle}>Seguridad</h3>
                <div className={styles.sectionDivider} />

                <div className={styles.field} style={{ maxWidth: '320px' }}>
                  <label htmlFor="currentPassword">Contraseña actual</label>
                  <input
                    id="currentPassword"
                    type="password"
                    value={security.currentPassword}
                    onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.field}>
                    <label htmlFor="newPassword">Nueva contraseña</label>
                    <input
                      id="newPassword"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={security.newPassword}
                      onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="confirmPassword">Confirmar nueva contraseña</label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={security.confirmPassword}
                      onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>

                <div className={styles.saveBar}>
                  <button type="submit" className={styles.saveBtnSecondary}>
                    Actualizar contraseña
                  </button>
                </div>
              </form>

              {/* Sección 3 — Preferencias */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>
                  Preferencias de {roleLabel}
                </h3>
                <div className={styles.sectionDivider} />
                <PreferencesSection role={user?.role} prefs={prefs} setPrefs={setPrefs} />
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
