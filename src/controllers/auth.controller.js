class AuthController {
  constructor (authService) {
    this.authService = authService
  }

  async login (req, res, next) {
    try {
      const { email, password } = req.body
      const { user, token } = await this.authService.login(email, password)
      res.json({
        user,
        token
      })
    } catch (error) {
      next(error)
    }
  }

  async renewToken (req, res, next) {
    try {
      const { uuid, name } = req.user
      const { token } = await this.authService.renewToken(uuid, name)
      res.json({
        token,
        user: {
          ...req.user
        }
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = { AuthController }
