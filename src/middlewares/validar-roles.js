const Roles = require('../models/role.entity')

const haveRole = (...roles) => {
  return (req, res, next) => {
    console.log('🚀 ~ file: validar-roles.js ~ line 5 ~ return ~ req', req.user)

    if (!req.user) {
      return next(new Error('Error validating role'))
    }

    if (!roles.includes(req.user.role.name)) {
      return next(new Error('You do not have the necessary permissions'))
    }
    next()
  }
}

module.exports = { haveRole }
