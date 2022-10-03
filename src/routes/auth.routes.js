const { Router } = require('express')
const { check } = require('express-validator')

const { AuthController } = require('../controllers')
const { validateJwt, validateFields } = require('../middlewares')
const { UserService, AuthService } = require('../services')

const router = Router()

router.post(
  '/login',
  [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').not().isEmpty(),
    validateFields
  ],
  (req, res, next) => {
    const userService = new UserService()
    const authService = new AuthService(userService)
    const authController = new AuthController(authService)
    authController.login(req, res, next)
  }
)

router.get('/', [validateJwt], (req, res, next) => {
  const userService = new UserService()
  const authService = new AuthService(userService)
  const authController = new AuthController(authService)
  authController.renewToken(req, res, next)
})

module.exports = router
