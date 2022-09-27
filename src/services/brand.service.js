
const { Brand } = require('../models')

class BrandService {
  constructor (userService) {
    this.userService = userService
  }

  async list (limit, offset) {
    const [total, brands] = await Promise.all([
      Brand.countDocuments({ status: true }),
      Brand.find({ estado: true }).skip(Number(offset)).limit(Number(limit))
    ])
    return { total, brands }
  }

  async findOne (id) {
    return await Brand.findById(id)
  }

  async create (data) {
    const user = this.userService.findOne(data.user)
    if (!user) throw new Error('User not found')
    const brand = new Brand(data)
    await brand.save()
    return { brand }
  }

  async update (id, data) {
    if (data.user) {
      const user = this.userService.findOne(data.user)
      if (!user) throw new Error('User not found')
    }
    return await Brand.findByIdAndUpdate(id, data, { new: true })
  }

  async delete (id) {
    return await Brand.findByIdAndUpdate(id, { status: false }, { new: true })
  }
}

module.exports = { BrandService }
