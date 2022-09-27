const jwt = require('jsonwebtoken')

const ckeckJwt = (token = '') => {
  try {
    const { uuid } = jwt.verify(token, process.env.SECRETKEY)
    return [true, uuid]
  } catch (error) {
    return [false, null]
  }
}

const generateJwt = (uuid = '') => {
  return new Promise((resolve, reject) => {
    const payload = { uuid }
    jwt.sign(
      payload,
      process.env.SECRETKEY,
      {
        expiresIn: '12h'
      },
      (err, token) => {
        if (err) {
          reject(new Error('Error generating token'))
        } else {
          resolve(token)
        }
      }
    )
  })
}

module.exports = { ckeckJwt, generateJwt }
