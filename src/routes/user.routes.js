const { Router } = require('express')
const { check } = require('express-validator')
const {
  existsRole,
  emailInUse,
  existsUserById
} = require('../helpers')
const { validateJwt, haveRole, validateFields } = require('../middlewares')

const { UserService } = require('../services/user.service')
const { UserController } = require('../controllers/user.controller')

const router = Router()

const userService = new UserService()
const userController = new UserController(userService)

router.get('/', userController.getUsers)

router.get(
  '/:id',
  [
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existsUserById),
    validateFields
  ],
  userController.getUser
)

router.post(
  '/',
  [
    check('email', 'Invalid email').isEmail(),
    check('email').custom(emailInUse),
    check('name', 'Name is required').not().isEmpty(),
    check('password', 'Password must be at least 6 characters long').isLength({
      min: 6
    }),
    check('image', 'Image is required').not().isEmpty(),
    check('image', 'Invalid image URL').isURL(),
    check('role').custom(existsRole),
    validateFields
  ],
  userController.createUser
)

router.put(
  '/:id',
  [
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(existsUserById),
    check('role', 'Role is required').not().isEmpty(),
    check('role').custom(existsRole),
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is required').not().isEmpty(),
    check('email', 'Invalid email').isEmail(),
    validateFields
  ],
  userController.updateUser
)

router.delete(
  '/:id',
  [
    validateJwt,
    haveRole('ADMIN_ROLE'),
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(existsUserById),
    validateFields
  ],
  userController.deleteUser
)

module.exports = router
