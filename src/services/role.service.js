
const { Role } = require('../models')

class RoleService {
  async list (limit, offset) {
    const [total, roles] = await Promise.all([
      Role.countDocuments({ status: true }),
      Role.find({ status: true }).skip(Number(offset)).limit(Number(limit))
    ])
    return { total, roles }
  }

  async findOne (id) {
    return await Role.findById(id)
  }

  async findByName (name) {
    const role = await Role.findOne({ name })
    if (!role) {
      throw new Error(`Role ${name} not found`)
    }
    return role
  }

  async create (data) {
    const role = new Role(data)
    await role.save()
    return { role }
  }

  async update (id, data) {
    return await Role.findByIdAndUpdate(id, data, { new: true })
  }

  async delete (id) {
    return await Role.findByIdAndUpdate(id, { status: false }, { new: true })
  }
}

module.exports = { RoleService }
