const { Router } = require('express')
const { check } = require('express-validator')
const { existsRole, emailInUse, existsUserById } = require('../helpers')
const { validateJwt, haveRole, validateFields } = require('../middlewares')

const { UserService, RoleService, CategoryService, BrandService, ProductService, OrderService, ProviderService } = require('../services')
const { UserController, ProductController, OrderController } = require('../controllers')

const router = Router()

router.get('/', (req, res, next) => {
  const roleService = new RoleService()
  const userService = new UserService(roleService)
  const userController = new UserController(userService)
  userController.getUsers(req, res, next)
})

router.get(
  '/:id/products',
  [
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(existsUserById),
    validateFields
  ], (req, res, next) => {
    const roleService = new RoleService()
    const userService = new UserService(roleService)
    const categoryService = new CategoryService(userService)
    const brandService = new BrandService(userService)
    const productService = new ProductService(
      userService,
      categoryService,
      brandService
    )
    const productController = new ProductController(productService)
    productController.getProductsByUser(req, res, next)
  }
)

router.get(
  '/:id/orders',
  [
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(existsUserById),
    validateFields
  ], (req, res, next) => {
    const roleService = new RoleService()
    const userService = new UserService(roleService)
    const categoryService = new CategoryService(userService)
    const brandService = new BrandService(userService)
    const productService = new ProductService(
      userService,
      categoryService,
      brandService
    )

    const providerService = new ProviderService(roleService)
    const orderService = new OrderService(
      userService,
      providerService,
      productService
    )

    const orderController = new OrderController(orderService)
    orderController.getOrdersByUser(req, res, next)
  }
)

router.get(
  '/:id',
  [
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existsUserById),
    validateFields
  ],
  (req, res, next) => {
    const roleService = new RoleService()
    const userService = new UserService(roleService)
    const userController = new UserController(userService)
    userController.getUser(req, res, next)
  }
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
  (req, res, next) => {
    const roleService = new RoleService()
    const userService = new UserService(roleService)
    const userController = new UserController(userService)
    userController.createUser(req, res, next)
  }
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
  (req, res, next) => {
    const roleService = new RoleService()
    const userService = new UserService(roleService)
    const userController = new UserController(userService)
    userController.updateUser(req, res, next)
  }
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
  (req, res, next) => {
    const roleService = new RoleService()
    const userService = new UserService(roleService)
    const userController = new UserController(userService)
    userController.deleteUser(req, res, next)
  }
)

module.exports = router
