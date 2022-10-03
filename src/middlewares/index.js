
const validateJwt = require('./validate-jwt')
const valicarRoles = require('../middlewares/validar-roles')
const validarCampos = require('../middlewares/validar-campos')
const validarArchivo = require('./validar-archivo')
const errorHandler = require('./error.handler')

module.exports = {
  ...validateJwt,
  ...valicarRoles,
  ...validarCampos,
  ...validarArchivo,
  ...errorHandler
}
