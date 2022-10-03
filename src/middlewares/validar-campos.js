const { validationResult } = require('express-validator')

const validateFields = (req, res, next) => {
  const errors = validationResult(req)
  console.log('errors', errors)
  if (!errors.isEmpty()) {
    return next(errors)
  }
  next()
}

module.exports = { validateFields }
