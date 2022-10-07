const bcryptjs = require('bcryptjs')
const { User } = require('../models')
const { generateJwt } = require('../helpers')

class UserService {
  constructor (roleService) {
    this.roleService = roleService
  }

  async list (limit, offset) {
    const [total, users] = await Promise.all([
      User.countDocuments({ status: true }),
      User.find({ status: true })
        .skip(Number(offset))
        .limit(Number(limit))
        .populate('role')
    ])
    return { total, users }
  }

  async findOne (id) {
    return await User.findById(id).populate('role')
  }

  async findOneByEmail (email) {
    return await User.findOne({ email }).populate('role')
  }

  async create (data) {
    let role = ''
    if (data.role) {
      role = await this.roleService.findByName(data.role)
    } else {
      role = await this.roleService.findByName('USER_ROLE')
    }
    const user = new User({ ...data, role })
    const salt = bcryptjs.genSaltSync()
    user.password = bcryptjs.hashSync(data.password, salt)
    await user.save()
    const token = await generateJwt({ uuid: user.id, name: user.name })
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
