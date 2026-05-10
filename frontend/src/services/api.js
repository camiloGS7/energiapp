import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

// Adjunta el token JWT en cada petición si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('energiapp_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login',    data),
}

export const userService = {
  updateProfile: (data) => api.put('/users/profile', data),
}

export const dashboardService = {
  getConsumo: (params = {}) => {
    const query = new URLSearchParams()
    if (params.desde) query.append('desde', params.desde)
    if (params.hasta) query.append('hasta', params.hasta)
    const qs = query.toString()
    return api.get(`/dashboard/consumo${qs ? '?' + qs : ''}`)
  },
}

export default api
