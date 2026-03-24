require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { initDB } = require('./db/database')

async function start() {
  const db = await initDB()

  const app = express()
  const PORT = process.env.PORT || 3000

  app.use(cors())
  app.use(express.json())

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'EnergiApp' })
  })

  app.use('/api/auth',  require('./routes/auth')(db))
  app.use('/api/users', require('./routes/users')(db))

  app.listen(PORT, () => {
    console.log(`EnergiApp backend corriendo en http://localhost:${PORT}`)
  })
}

start().catch(err => {
  console.error('Error al iniciar EnergiApp:', err)
  process.exit(1)
})
