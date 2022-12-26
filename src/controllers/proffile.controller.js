class CategoryController {
    constructor (categoryService) {
      this.categoryService = categoryService
    }
  
    async getCategories (req, res, next) {
      try {
        const { limit = 10, offset = 0 } = req.query
        const rta = await this.categoryService.list(limit, offset)
        res.status(200).json({ ok: true, message: 'Categories listed', ...rta })
      } catch (error) {
        next(error)
      }
    }
  
    async getCategory (req, res, next) {
      try {
        const id = req.params.id
        const rta = await this.categoryService.findOne(id)
        res.status(200).json({ ok: true, message: 'Category listed', ...rta })
      } catch (error) {
        next(error)
      }
    }
  
    async createCategory (req, res, next) {
      try {
        const { name, description } = req.body
        const { _id: user } = req.user
        const rta = await this.categoryService.create({
          name,
          description,
          user
        })
        res.status(200).json({ ok: true, message: 'Category created', ...rta })
      } catch (error) {
        next(error)
      }
    }
  
    async updateCategory (req, res, next) {
      try {
        const id = req.params.id
        const data = req.body
        const rta = await this.categoryService.update(id, data)
        res.status(200).json({ ok: true, message: 'Category updated', ...rta })
      } catch (error) {
        next(error)
      }
    }
  
    async deleteCategory (req, res, next) {
      try {
        const { id } = req.params
        const rta = await this.categoryService.delete(id)
        res.status(200).json({ ok: true, message: 'Category deleted', ...rta })
      } catch (error) {
        next(error)
      }
    }
  }
  
  module.exports = { CategoryController }
  