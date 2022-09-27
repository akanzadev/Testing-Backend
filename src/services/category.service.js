const { Category } = require('../models')

class CategoryService {
  constructor (userService) {
    this.userService = userService
  }

  async list (limit, offset) {
    const [total, categories] = await Promise.all([
      Category.countDocuments({ estado: true }),
      Category.find({ status: true })
        .populate('user', ['_id'])
        .skip(Number(offset))
        .limit(Number(limit))
    ])
    return { total, categories }
  }

  async findOne (id) {
    return await Category.findById(id)
  }

  async create (data) {
    const user = this.userService.findOne(data.user)
    if (!user) throw new Error('User not found')
    const category = new Category(data)
    await category.save()
    return { brand: category }
  }

  async update (id, data) {
    if (data.user) {
      const user = this.userService.findOne(data.user)
      if (!user) throw new Error('User not found')
    }
    return await Category.findByIdAndUpdate(id, data, { new: true })
  }

  async delete (id) {
    return await Category.findByIdAndUpdate(id, { status: false }, { new: true })
  }
}

module.exports = { CategoryService }
