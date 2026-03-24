module.exports = (db) => {
  const updateProfile = (req, res) => {
    const { name, email, phone } = req.body
    const userId = req.user.id

    if (!name || !email) {
      return res.status(400).json({ error: 'Nombre y email son obligatorios' })
    }

    // Verifica que el email no lo use otro usuario
    const taken = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email, userId)
    if (taken) {
      return res.status(409).json({ error: 'El email ya está en uso por otra cuenta' })
    }

    db.prepare('UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?')
      .run(name, email, phone || null, userId)

    const updated = db.prepare(
      'SELECT id, name, email, role, phone, created_at FROM users WHERE id = ?'
    ).get(userId)

    res.json({ user: updated })
  }

  return { updateProfile }
}
