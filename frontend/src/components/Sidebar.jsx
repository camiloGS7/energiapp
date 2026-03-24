import { Link, useNavigate } from 'react-router-dom'
import { Zap, LayoutDashboard, BarChart2, UserCircle, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import styles from '../pages/Dashboard.module.css'

/**
 * Sidebar compartido entre Dashboard y Profile.
 * @param {'dashboard'|'profile'} activePage — qué ítem resaltar
 */
export default function Sidebar({ activePage }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <div className={styles.sidebarLogo}>
          <div className={styles.sidebarLogoMark}>
            <Zap size={15} strokeWidth={2.5} />
          </div>
          <span className={styles.sidebarLogoText}>EnergiApp</span>
        </div>
      </div>

      <nav className={styles.nav}>
        <span className={styles.navLabel}>General</span>

        <Link
          to="/dashboard"
          className={styles.navItem}
          data-active={activePage === 'dashboard' ? 'true' : undefined}
        >
          <LayoutDashboard size={15} />
          Dashboard
        </Link>

        <Link to="#" className={styles.navItem}>
          <BarChart2 size={15} />
          Reportes
        </Link>

        <span className={styles.navLabel}>Cuenta</span>

        <Link
          to="/profile"
          className={styles.navItem}
          data-active={activePage === 'profile' ? 'true' : undefined}
        >
          <UserCircle size={15} />
          Perfil
        </Link>

        <Link to="#" className={styles.navItem}>
          <Settings size={15} />
          Configuración
        </Link>
      </nav>

      <div className={styles.sidebarFooter}>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={15} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
