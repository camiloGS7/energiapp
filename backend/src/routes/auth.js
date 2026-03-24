const express = require('express')

module.exports = (db) => {
  const router = express.Router()
  const { register, login } = require('../controllers/authController')(db)

  router.post('/register', register)
  router.post('/login', login)

  return router
}
