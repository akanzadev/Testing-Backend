class ProductController {
  constructor (productService) {
    this.productService = productService
  }

  async getProducts (req, res, next) {
    try {
      const { limit = 10, offset = 0 } = req.query
      const rta = await this.productService.list(limit, offset)
      res.status(200).json({ ok: true, message: 'Products listed', ...rta })
    } catch (error) {
      next(error)
    }
  }

  async getProduct (req, res, next) {
    try {
      const id = req.params.id
      const product = await this.productService.findOne(id)
      res.status(200).json({ ok: true, message: 'Product listed', ...product })
    } catch (error) {
      next(error)
    }
  }

  async getProductsByName (req, res, next) {
    try {
      const { name } = req.params
      const rta = await this.productService.findForName(name)
      res.status(200).json({ ok: true, message: 'Product listed', ...rta })
    } catch (error) {
      next(error)
    }
  }

  async getProductsByUser (req, res, next) {
    try {
      const id = req.params.id
      const rta = await this.productService.findForUser(id)
      res.status(200).json({ ok: true, message: 'Products listed', ...rta })
    } catch (error) {
      next(error)
    }
  }

  async createProduct (req, res, next) {
    try {
      const { name, description, stock, price, category, brand } = req.body
      const { _id: user } = req.user
      const product = await this.productService.create({
        name,
        description,
        stock: stock || 0,
        price: price || 0,
        category,
        brand,
        user
      })
      res.status(200).json({ ok: true, message: 'Product created', ...product })
    } catch (error) {
      next(error)
    }
  }

  async updateProduct (req, res, next) {
    try {
      const id = req.params.id
      const data = req.body
      const rta = await this.productService.update(id, data)
      res.status(200).json({ ok: true, message: 'Product updated', ...rta })
    } catch (error) {
      next(error)
    }
  }

  async deleteProduct (req, res, next) {
    try {
      const { id } = req.params
      const rta = await this.productService.delete(id)
      res.status(200).json({ ok: true, message: 'Product deleted', ...rta })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = { ProductController }
