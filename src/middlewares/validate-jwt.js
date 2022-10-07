const jwt = require('jsonwebtoken')

const User = require('../models/user.entity')

const validateJwt = async (req, res, next) => {
  try {
    const token = req.header('x-token')

    if (!token) { return next(new Error('No hay token en la petición')) }

    const { uuid } = jwt.verify(token, process.env.SECRETKEY)
    const user = await User.findById({ _id: uuid }).populate('role', ['name'])

    if (!user) { return next(new Error('No existe el usuario')) }

    if (!user.status) {
      return next(new Error('El usuario no está activo'))
    }

    req.user = user

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = { validateJwt }
