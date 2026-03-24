import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Store, Leaf } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/api'
import AuthLayout from './AuthLayout'
import styles from './Auth.module.css'

const ROLES = [
  {
    value: 'cliente',
    Icon: User,
    label: 'Cliente',
    desc: 'Monitorea el consumo energético de tu hogar o espacio personal',
  },
  {
    value: 'comercio',
    Icon: Store,
    label: 'Comercio',
    desc: 'Gestiona y optimiza la energía de tu negocio o local comercial',
  },
  {
    value: 'fundacion',
    Icon: Leaf,
    label: 'Fundación',
    desc: 'Administra proyectos e iniciativas de energía sostenible',
  },
]

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  function selectRole(role) {
    setForm({ ...form, role })
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.role) {
      setError('Selecciona un tipo de cuenta para continuar')
      return
    }
    setLoading(true)
    try {
      const { data } = await authService.register(form)
      login(data.user, data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      panelTitle="Elige cómo participas en la red energética"
      panelSubtitle="Cada rol tiene acceso a herramientas diseñadas específicamente para su tipo de uso."
    >
      <h1 className={styles.title}>Crear cuenta</h1>
      <p className={styles.subtitle}>Selecciona el tipo de cuenta que mejor describe tu perfil</p>

      {/* Selector de rol — lista vertical */}
      <div className={styles.roleList}>
        {ROLES.map(({ value, Icon, label, desc }) => (
          <button
            key={value}
            type="button"
            className={`${styles.roleCard} ${form.role === value ? styles.roleSelected : ''}`}
            onClick={() => selectRole(value)}
          >
            <div className={styles.roleIconWrap}>
              <Icon size={16} strokeWidth={2} />
            </div>
            <div className={styles.roleCardText}>
              <span className={styles.roleLabel}>{label}</span>
              <span className={styles.roleDesc}>{desc}</span>
            </div>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="name">Nombre completo</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Juan García"
            value={form.name}
            onChange={handleChange}
            required
            autoComplete="name"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="nombre@empresa.com"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            minLength={6}
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.btn} disabled={loading}>
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>

      <p className={styles.switch}>
        ¿Ya tienes cuenta?{' '}
        <Link to="/login">Iniciar sesión</Link>
      </p>
    </AuthLayout>
  )
}
