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
    const category = await Category.findOne({ _id: id, status: true })
    if (!category) throw new Error('Category not found or deleted')
    return category
  }

  async findForName (name) {
    const category = await Category.findOne({ name, status: true })
    if (!category) throw new Error('Category not found')
    return category
  }

  async create (data) {
    const user = this.userService.findOne(data.user)
    if (!user) throw new Error('User not found')
    const newCategory = new Category(data)
    await newCategory.save()
    return newCategory
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
    const category = await this.findOne(id)
    if (category.name === data.name) { throw new Error('Name for category already in use') }
    return {
      message: 'Category updated',
      category: await Category.findByIdAndUpdate(id, data, { new: true })
    }
  }

  async delete (id) {
    return {
      message: 'Category deleted',
      category: await Category.findByIdAndUpdate(
        id,
        { status: false },
        { new: true }
      )
    }
  }
}

module.exports = { CategoryService }
