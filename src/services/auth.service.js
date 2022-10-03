const bcryptjs = require('bcryptjs')
const { generateJwt } = require('../helpers')

class AuthService {
  constructor (userService) {
    this.userService = userService
  }

  async login (email, password) {
    const user = await this.userService.findOneByEmail(email)
    if (!user) {
      throw new Error('Email or password incorrect')
    }
    if (!user.status) {
      throw new Error('Email or password incorrect - status: false')
    }
    const isValidPassword = bcryptjs.compareSync(password, user.password)
    if (!isValidPassword) {
      throw new Error('Email or password incorrect')
    }
    const token = await generateJwt({ uuid: user._id, name: user.name })
    return {
      user,
      token
    }
  }

  async renewToken (uuid, name) {
    const token = await generateJwt({ uuid, name })
    return {
      token
    }
  }
}

module.exports = { AuthService }
