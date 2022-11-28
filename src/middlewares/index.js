
const validateJwt = require('./validate-jwt')
const valicarRoles = require('../middlewares/validar-roles')
const validarCampos = require('../middlewares/validar-campos')
const errorHandler = require('./error.handler')
const createOrderItem = require('./order-entity.handler')

module.exports = {
  ...validateJwt,
  ...valicarRoles,
  ...validarCampos,
  ...errorHandler,
  ...createOrderItem
}
