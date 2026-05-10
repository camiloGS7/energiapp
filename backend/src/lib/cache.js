const NodeCache = require('node-cache');

// TTL de 60 segundos, revisa expiración cada 30 segundos
const cache = new NodeCache({
  stdTTL: 60,
  checkperiod: 30,
  useClones: false,
});

module.exports = cache;
