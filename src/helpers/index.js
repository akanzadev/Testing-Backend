const dbValidators = require('./db-validators')
const handleJwt = require('./handle-jwt')
const SubirArchivo = require('./subir.archivo')

module.exports = {
  ...dbValidators,
  ...SubirArchivo,
  ...handleJwt
}
