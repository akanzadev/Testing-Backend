function logErrors (err, req, res, next) {
  if (process.env.MODE === 'development') {
    console.error('Log Error', err)
  }
  next(err)
}

function expressValErrors (err, req, res, next) {
  const { errors = false } = err
  if (errors) {
    const error = new Error()
    error.status = 400
    console.log('errors', errors)
    error.message = errors.map((error) => error.msg)
    next(error)
  }
  next(err)
}

function errorHandler (err, req, res, next) {
  res.status(500).json({
    ok: false,
    message: err.message,
    stack: err.stack
  })
}

module.exports = { logErrors, errorHandler, expressValErrors }
