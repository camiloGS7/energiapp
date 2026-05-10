const express = require('express');
const { getConsumo } = require('../controllers/dashboardController');

const router = express.Router();

router.get('/consumo', getConsumo);

module.exports = router;
