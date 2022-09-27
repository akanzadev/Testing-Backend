
const bcryptjs = require('bcryptjs')
const { User } = require('../models')
const { generateJwt } = require('../helpers')

class UserService {
  async list (limit, offset) {
    const [total, users] = await Promise.all([
      User.countDocuments({ estado: true }),
      User.find({ estado: true }).skip(Number(offset)).limit(Number(limit))
    ])
    return { total, users }
  }

  async findOne (id) {
    return await User.findById(id)
  }

  async create (data) {
    const user = new User(data)
    const salt = bcryptjs.genSaltSync()
    user.password = bcryptjs.hashSync(data.password, salt)
    await user.save()
    const token = await generateJwt(user.uid)
    return {
      token,
      user
    }
  }

  async update (id, data) {
    if (data.password) {
      const salt = bcryptjs.genSaltSync()
      data.password = bcryptjs.hashSync(data.password, salt)
    }
    return await User.findByIdAndUpdate(id, data, { new: true })
  }

  async delete (id) {
    return await User.findByIdAndUpdate(id, { estado: false }, { new: true })
  }
}

module.exports = { UserService }
