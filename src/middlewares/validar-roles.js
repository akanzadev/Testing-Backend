const haveRole = (...roles) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return next(new Error('Error validating role'))
    }

    if (!roles.includes(req.user.role)) {
      return next(new Error('You do not have the necessary permissions'))
    }
    next()
  }
}

module.exports = { haveRole }
