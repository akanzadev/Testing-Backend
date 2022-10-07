const { Product } = require('../models')

class ProductService {
  constructor (userService, categoryService, brandService) {
    this.userService = userService
    this.categoryService = categoryService
    this.brandService = brandService
  }

  async list (limit, offset) {
    const [total, products] = await Promise.all([
      Product.countDocuments({ status: true }),
      Product.find({ status: true })
        .populate('user', ['_id'])
        .populate('category', ['_id', 'user', 'name'])
        .populate('brand', ['_id', 'user', 'name'])
        .skip(Number(offset))
        .limit(Number(limit))
    ])
    return { total, products }
  }

  async findOne (id) {
    const product = await Product.findOne({ _id: id, status: true })
      .populate('category', ['name'])
      .populate('brand', ['name'])
    if (!product) throw new Error('Product not found')
    return product
  }

  async findForName (name) {
    const product = await Product.findOne({ name, status: true })
    if (!product) throw new Error('Product not found')
    return product
  }

  async findForUser (id) {
    const products = await Product.find({ user: id, status: true })
      .populate('category', ['name'])
      .populate('brand', ['name'])
    return products
  }

  async findForCategory (name) {
    const category = await this.categoryService.findForName(name)
    const products = await Product.find({
      category: category._id,
      status: true
    })
    return products
  }

  async create (data) {
    const user = await this.userService.findOne(data.user)
    await this.findProductForName(data.name)
    const category = await this.categoryService.findOne(data.category)
    const brand = await this.brandService.findOne(data.brand)

    const newProduct = new Product({
      name: data.name,
      description: data.description,
      price: data.price,
      category: category._id,
      brand: brand._id,
      user: user._id
    })
    await newProduct.save()
    return newProduct
  }

  async update (id, data) {
    if (data.user) {
      const user = this.userService.findOne(data.user)
      if (!user) throw new Error('User not found')
    }
    if (data.category) {
      const category = this.categoryService.findOne(data.category)
      if (!category) throw new Error('Category not found')
    }
    if (data.brand) {
      const brand = this.brandService.findOne(data.brand)
      if (!brand) throw new Error('Brand not found')
    }
    return await Product.findByIdAndUpdate(id, data, { new: true })
  }

  async delete (id) {
    return await Product.findByIdAndUpdate(
      id,
      { status: false },
      { new: true }
    )
  }
}

module.exports = { ProductService }
