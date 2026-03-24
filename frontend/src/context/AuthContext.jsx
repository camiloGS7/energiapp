import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('energiapp_user')) } catch { return null }
  })
  const [token, setToken] = useState(() => localStorage.getItem('energiapp_token'))

  function login(userData, jwt) {
    setUser(userData)
    setToken(jwt)
    localStorage.setItem('energiapp_user', JSON.stringify(userData))
    localStorage.setItem('energiapp_token', jwt)
  }

  function logout() {
    setUser(null)
    setToken(null)
    localStorage.removeItem('energiapp_user')
    localStorage.removeItem('energiapp_token')
  }

  function updateUser(newData) {
    const updated = { ...user, ...newData }
    setUser(updated)
    localStorage.setItem('energiapp_user', JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
