
class RoleController {
  constructor (roleService) {
    this.roleService = roleService
  }

  async getRoles (req, res, next) {
    try {
      const { limit = 10, offset = 0 } = req.query
      const rta = await this.roleService.list(limit, offset)
      res.status(200).json({ ok: true, message: 'Roles listed', ...rta })
    } catch (error) {
      next(error)
    }
  }

  async getRole (req, res, next) {
    try {
      const id = req.params.id
      const rta = await this.roleService.findOne(id)
      res.status(200).json({ ok: true, message: 'Role listed', ...rta })
    } catch (error) {
      next(error)
    }
  }

  async createRole (req, res, next) {
    try {
      const { name, description } = req.body
      const rta = await this.roleService.create({ name, description })
      res.status(200).json({ ok: true, message: 'Role created', ...rta })
    } catch (error) {
      next(error)
    }
  }

  async updateRole (req, res, next) {
    try {
      const id = req.params.id
      const { description } = req.body
      const rta = await this.roleService.update(id, { description })
      res.status(200).json({ ok: true, message: 'Role updated', ...rta })
    } catch (error) {
      next(error)
    }
  }

  async deleteRole (req, res, next) {
    try {
      const { id } = req.params
      const rta = await this.roleService.delete(id)
      res.status(200).json({ ok: true, message: 'Role deleted', ...rta })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = { RoleController }
