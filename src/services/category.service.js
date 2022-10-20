const { Category } = require('../models')

class CategoryService {
  constructor (userService) {
    this.userService = userService
  }

  async list (limit, offset) {
    const [total, categories] = await Promise.all([
      Category.countDocuments({ status: true }),
      Category.find({ status: true })
        .populate('user', ['_id'])
        .skip(Number(offset))
        .limit(Number(limit))
    ])
    return { total, categories }
  }

  async findOne (id) {
    const category = await Category.findOne({ _id: id, status: true }).populate('user', ['_id'])
    if (!category) throw new Error('Category not found or deleted')
    return { category }
  }

  async findForName (name) {
    const category = await Category.findOne({ name, status: true })
    if (!category) throw new Error('Category not found')
    return category
  }

  async create (data) {
    const user = this.userService.findOne(data.user)
    if (!user) throw new Error('User not found')
    const category = new Category(data)
    await category.save()
    return { category }
  }

  async update (id, data) {
    if (data.user) {
      const user = this.userService.findOne(data.user)
      if (!user) throw new Error('User not found')
    }
    if (!data.name) {
      return {
        message: 'Category updated',
        category: await Category.findByIdAndUpdate(id, data, { new: true })
      }
    }
    const categoryExist = await this.findOne(id)
    if (categoryExist.name === data.name) { throw new Error('Name for category already in use') }

    const category = await Category.findByIdAndUpdate(id, data, { new: true })
    return { category }
  }

  async delete (id) {
    const category = await Category.findByIdAndUpdate(
      id,
      { status: false },
      { new: true }
    )
    return { category }
  }
}

module.exports = { CategoryService }
