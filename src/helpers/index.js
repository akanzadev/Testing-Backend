const dbValidators = require('./db-validators')
const handleJwt = require('./handle-jwt')

module.exports = {
  ...dbValidators,
  ...handleJwt
}
