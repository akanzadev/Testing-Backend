const { Router } = require('express')
const { check } = require('express-validator')

const {
  existsOrder,
  existsProviderById,
  existsProduct
} = require('../helpers/db-validators')
const {
  validateFields,
  validateJwt,
  haveRole
} = require('../middlewares')

const {
  UserService,
  BrandService,
  CategoryService,
  RoleService,
  ProductService,
  OrderService,
  ProviderService
} = require('../services')
const { OrderController } = require('../controllers')

const router = Router()

router.get('/', (req, res, next) => {
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
  orderController.getOrders(req, res, next)
})

router.get(
  '/:id',
  [
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(existsOrder),
    validateFields
  ],
  (req, res, next) => {
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
    orderController.getOrder(req, res, next)
  }
)

router.post(
  '/',
  [
    validateJwt,
    check(
      'provider',
      'Provider is required and must be a valid ID'
    ).isMongoId(),
    check('provider').custom(existsProviderById),
    check('items', 'Items is Array of MongoIDs and not empty')
      .isArray()
      .not()
      .isEmpty(),
    check(
      'items.*.product',
      'Product is required and must be a valid ID'
    ).isMongoId(),
    check('items.*.product').custom(existsProduct),
    check(
      'items.*.quantity',
      'Quantity is required and must be a number'
    ).isNumeric(),
    check(
      'items.*.quantity',
      'Quantity is required and must be greater than 0'
    ).custom((value) => value > 0),
    validateFields
  ],
  (req, res, next) => {
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
    orderController.createOrder(req, res, next)
  }
)

router.put(
  '/:id',
  [
    validateJwt,
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(existsOrder),
    validateFields
  ],
  (req, res, next) => {
    const roleService = new RoleService()
    const userService = new UserService(roleService)
    const categoryService = new CategoryService(userService)
    const brandService = new BrandService(userService)
    const productService = new ProductService(
      userService,
      categoryService,
      brandService
    )
    const productController = new OrderController(productService)
    productController.updateProduct(req, res, next)
  }
)

router.delete(
  '/:id',
  [validateJwt, haveRole('ADMIN_ROLE'), check('id', 'Invalid ID').isMongoId()],
  (req, res, next) => {
    const userService = new UserService()
    const categoryService = new CategoryService(userService)
    const brandService = new BrandService(userService)
    const productController = new OrderController(
      userService,
      categoryService,
      brandService
    )
    productController.deleteProduct(req, res, next)
  }
)

module.exports = router
