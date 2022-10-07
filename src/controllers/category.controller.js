class CategoryController {
  constructor (categoryService) {
    this.categoryService = categoryService
  }

  async getCategories (req, res, next) {
    try {
      const { limit = 10, offset = 0 } = req.query
      const categories = await this.categoryService.list(limit, offset)
      res.status(200).json(categories)
    } catch (error) {
      next(error)
    }
  }

  async getCategory (req, res, next) {
    try {
      const id = req.params.id
      const category = await this.categoryService.get(id)
      res.status(200).json(category)
    } catch (error) {
      next(error)
    }
  }

  async createCategory (req, res, next) {
    console.log(
      '🚀 ~ file: category.controller.js ~ line 28 ~ CategoryController ~ createCategory ~ req',
      req
    )
    try {
      const { name, description } = req.body
      const { uuid: user } = req.user
      console.log({ name, description, user })
      const category = await this.categoryService.create({
        name,
        description,
        user
      })
      res.status(200).json(category)
    } catch (error) {
      next(error)
    }
  }

  async updateCategory (req, res, next) {
    try {
      const id = req.params.id
      const { description } = req.body
      const category = await this.categoryService.update(id, {
        description
      })
      res.status(200).json({ category })
    } catch (error) {
      next(error)
    }
  }

  async deleteCategory (req, res, next) {
    try {
      const { id } = req.params
      const category = await this.categoryService.delete(id)
      res.status(200).json(category)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = { CategoryController }
