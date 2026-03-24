const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const VALID_ROLES = ['comercio', 'cliente', 'fundacion']

module.exports = (db) => {
  const register = async (req, res) => {
    const { name, email, password, role } = req.body

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' })
    }
    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({ error: 'Rol inválido' })
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
    if (existing) {
      return res.status(409).json({ error: 'El email ya está registrado' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const result = db.prepare(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)'
    ).run(name, email, hashedPassword, role)

    const token = jwt.sign(
      { id: result.lastInsertRowid, email, role },
      process.env.JWT_SECRET || 'dev_secret',
      { expiresIn: '7d' }
    )

    const newUser = db.prepare(
      'SELECT id, name, email, role, phone, created_at FROM users WHERE id = ?'
    ).get(result.lastInsertRowid)

    res.status(201).json({ token, user: newUser })
  }

  const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios' })
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'dev_secret',
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone ?? null, created_at: user.created_at }
    })
  }

  return { register, login }
}
