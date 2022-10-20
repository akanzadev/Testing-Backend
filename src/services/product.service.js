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
    return { product }
  }

  async findForName (name) {
    const [total, products] = await Promise.all([
      Product.countDocuments({ name: new RegExp(name, 'i'), status: true }),
      Product.find({ name: { $regex: name, $options: 'i' }, status: true })
        .populate('category', ['name'])
        .populate('brand', ['name'])
    ])
    return { total, products }
  }

  async findForUser (id) {
    const [total, products] = await Promise.all([
      Product.countDocuments({ user: id, status: true }),
      Product.find({ user: id, status: true })
        .populate('category', ['name'])
        .populate('brand', ['name'])
    ])
    return { total, products }
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
    const productExists = await Product.findOne({ name: data.name, status: true })
    if (productExists) throw new Error('Product already exists')
    const category = await this.categoryService.findOne(data.category)
    const brand = await this.brandService.findOne(data.brand)
    const product = new Product({
      name: data.name,
      description: data.description,
      stock: data.stock,
      price: data.price,
      category: category._id,
      brand: brand._id,
      user: user._id
    })
    await product.save()
    return { product }
  }

  async update (id, data) {
    if (data.name) {
      const currentProduct = await Product.findOne({ _id: id, status: true })
      if (currentProduct.name !== data.name) {
        const productExists = await Product.findOne({
          name: data.name,
          status: true
        })
        if (productExists) throw new Error('Product already exists')
      }
    }

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

    const product = await Product.findByIdAndUpdate(id, data, { new: true })
    return { product }
  }

  async delete (id) {
    const product = await Product.findByIdAndUpdate(
      id,
      { status: false },
      { new: true }
    )
    return { product }
  }
}

module.exports = { ProductService }
