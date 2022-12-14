
const { Brand } = require('../models')

class BrandService {
  constructor (userService) {
    this.userService = userService
  }

  async list (limit, offset) {
    const [total, brands] = await Promise.all([
      Brand.countDocuments({ status: true }),
      Brand.find({ status: true })
        .populate('user', ['_id']).skip(Number(offset)).limit(Number(limit))
    ])
    return { total, brands }
  }

  async findOne (id) {
    const brand = await Brand.findOne({ _id: id, status: true }).populate('user', ['_id'])
    if (!brand) throw new Error('Brand not found or deleted')
    return { brand }
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
    if (!data.name) {
      return {
        message: 'Brand updated',
        category: await Brand.findByIdAndUpdate(id, data, { new: true })
      }
    }
    const brandExists = await this.findOne(id)
    if (brandExists.name === data.name) { throw new Error('Name for brand already in use') }

    const brand = await Brand.findByIdAndUpdate(id, data, { new: true })
    return { brand }
  }

  async delete (id) {
    const brand = await Brand.findByIdAndUpdate(id, { status: false }, { new: true })
    return { brand }
  }
}

module.exports = { BrandService }
