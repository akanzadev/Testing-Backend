
class RoleController {
  constructor (roleService) {
    this.roleService = roleService
  }

  async getRoles (req, res, next) {
    try {
      const { limit = 10, offset = 0 } = req.query
      const roles = await this.roleService.list(limit, offset)
      res.status(200).json(roles)
    } catch (error) {
      next(error)
    }
  }

  async getRole (req, res, next) {
    try {
      const id = req.params.id
      const role = await this.roleService.get(id)
      res.status(200).json(role)
    } catch (error) {
      next(error)
    }
  }

  async createRole (req, res, next) {
    try {
      const { name, description } = req.body
      const role = await this.roleService.create({
        name,
        description
      })
      res.status(200).json(role)
    } catch (error) {
      next(error)
    }
  }

  async updateRole (req, res, next) {
    try {
      const id = req.params.id
      const { description } = req.body
      const role = await this.roleService.update(id, {
        description
      })
      res.status(200).json(role)
    } catch (error) {
      next(error)
    }
  }

  async deleteRole (req, res, next) {
    try {
      const { id } = req.params
      const role = await this.roleService.delete(id)
      res.status(200).json(role)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = { RoleController }
