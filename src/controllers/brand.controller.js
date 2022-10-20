
class BrandController {
  constructor (brandService) {
    this.brandService = brandService
  }

  async getBrands (req, res, next) {
    try {
      const { limit = 10, offset = 0 } = req.query
      const rta = await this.brandService.list(limit, offset)
      res.status(200).json({ ok: true, message: 'Brands listed', ...rta })
    } catch (error) {
      next(error)
    }
  }

  async getBrand (req, res, next) {
    try {
      const id = req.params.id
      const rta = await this.brandService.findOne(id)
      res.status(200).json({ ok: true, message: 'Brand listed', ...rta })
    } catch (error) {
      next(error)
    }
  }

  async createBrand (req, res, next) {
    try {
      const { name, description } = req.body
      const { _id: user } = req.user
      const rta = await this.brandService.create({
        name,
        description,
        user
      })
      res.status(200).json({ ok: true, message: 'Brand created', ...rta })
    } catch (error) {
      next(error)
    }
  }

  async updateBrand (req, res, next) {
    try {
      const id = req.params.id
      const { description } = req.body
      const rta = await this.brandService.update(id, {
        description
      })
      res.status(200).json({ ok: true, message: 'Brand updated', ...rta })
    } catch (error) {
      next(error)
    }
  }

  async deleteBrand (req, res, next) {
    try {
      const { id } = req.params
      const rta = await this.brandService.delete(id)
      res.status(200).json({ ok: true, message: 'Brand deleted', ...rta })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = { BrandController }
