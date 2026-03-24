const express = require('express')
const authMiddleware = require('../middleware/auth')

module.exports = (db) => {
  const router = express.Router()
  const { updateProfile } = require('../controllers/userController')(db)

  router.put('/profile', authMiddleware, updateProfile)

  return router
}
