class ProductController {
  constructor (productController) {
    this.productController = productController
  }

  async getProducts (req, res, next) {
    try {
      const { limit = 10, offset = 0 } = req.query
      const products = await this.productService.list(limit, offset)
      res.status(200).json(products)
    } catch (error) {
      next(error)
    }
  }

  async getProduct (req, res, next) {
    try {
      const id = req.params.id
      const product = await this.productService.get(id)
      res.status(200).json(product)
    } catch (error) {
      next(error)
    }
  }

  async getProductByName (req, res, next) {
    try {
      const { name } = req.params
      const product = await this.productService.findForName(name)
      res.status(200).json(product)
    } catch (error) {
      next(error)
    }
  }

  async getProductByUser (req, res, next) {
    try {
      const { uuid: user } = req.user
      const product = await this.productService.findForUser(user)
      res.status(200).json(product)
    } catch (error) {
      next(error)
    }
  }

  async createProduct (req, res, next) {
    try {
      const { name, description, price, category, brand } = req.body
      const { uuid: user } = req.user
      const product = await this.productService.create({
        name,
        description,
        price,
        category,
        brand,
        user
      })
      res.status(200).json(product)
    } catch (error) {
      next(error)
    }
  }

  async deleteProduct (req, res, next) {
    try {
      const { id } = req.params
      const product = await this.productService.delete(id)
      res.status(200).json(product)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = { ProductController }
