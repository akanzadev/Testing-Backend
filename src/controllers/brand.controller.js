
class BrandController {
  constructor (brandService) {
    this.brandService = brandService
  }

  async getBrands (req, res, next) {
    try {
      const { limit = 10, offset = 0 } = req.query
      const brands = await this.brandService.list(limit, offset)
      res.status(200).json(brands)
    } catch (error) {
      next(error)
    }
  }

  async getBrand (req, res, next) {
    try {
      const id = req.params.id
      const brand = await this.brandService.get(id)
      res.status(200).json(brand)
    } catch (error) {
      next(error)
    }
  }

  async createBrand (req, res, next) {
    try {
      const { name, description } = req.body
      const { _id: user } = req.user
      const brand = await this.brandService.create({
        name,
        description,
        user
      })
      res.status(200).json(brand)
    } catch (error) {
      next(error)
    }
  }

  async updateBrand (req, res, next) {
    try {
      const id = req.params.id
      const { description } = req.body
      const brand = await this.brandService.update(id, {
        description
      })
      res.status(200).json(brand)
    } catch (error) {
      next(error)
    }
  }

  async deleteBrand (req, res, next) {
    try {
      const { id } = req.params
      const brand = await this.brandService.delete(id)
      res.status(200).json(brand)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = { BrandController }
