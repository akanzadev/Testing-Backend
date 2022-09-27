
class UserController {
  constructor (userService) {
    this.userService = userService
  }

  async getUsers (req, res, next) {
    try {
      const { limit = 10, offset = 0 } = req.query
      const users = await this.userService.list(limit, offset)
      res.status(200).json(users)
    } catch (error) {
      next(error)
    }
  }

  async getUser (req, res, next) {
    try {
      const id = req.params.id
      const user = await this.userService.get(id)
      res.status(200).json(user)
    } catch (error) {
      next(error)
    }
  }

  async createUser (req, res, next) {
    try {
      const { name, email, password, role, image } = req.body
      const user = await this.userService.create({
        name,
        email,
        password,
        role,
        image
      })
      res.status(200).json(user)
    } catch (error) {
      next(error)
    }
  }

  async updateUser (req, res, next) {
    try {
      const id = req.params.id
      const { _id, password, email, ...rest } = req.body
      const user = await this.userService.update(id, rest)
      res.status(200).json({ user })
    } catch (error) {
      next(error)
    }
  }

  async deleteUser (req, res, next) {
    try {
      const { id } = req.params
      const user = await this.userService.delete(id)
      res.status(200).json(user)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = { UserController }
