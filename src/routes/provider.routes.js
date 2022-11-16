const { Router } = require('express')
const { check } = require('express-validator')
const { existsRole, emailInUse, existsProviderById } = require('../helpers')
const { validateJwt, haveRole, validateFields } = require('../middlewares')

const { ProviderService, RoleService, UserService, CategoryService, BrandService, ProductService, OrderService } = require('../services')
const { ProviderController, OrderController } = require('../controllers')

const router = Router()

router.get('/', (req, res, next) => {
  const roleService = new RoleService()
  const providerService = new ProviderService(roleService)
  const providerController = new ProviderController(providerService)
  providerController.getProviders(req, res, next)
})

router.get(
  '/:id',
  [
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existsProviderById),
    validateFields
  ],
  (req, res, next) => {
    const roleService = new RoleService()
    const providerService = new ProviderService(roleService)
    const providerController = new ProviderController(providerService)
    providerController.getProvider(req, res, next)
  }
)

router.get(
  '/:id/orders',
  [
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(existsProviderById),
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
    orderController.getOrdersByProvider(req, res, next)
  }
)

router.post(
  '/',
  [
    check('email', 'Invalid email').isEmail(),
    check('email').custom(emailInUse),
    check('name', 'Name is required').not().isEmpty(),
    check('address', 'Address is required').not().isEmpty(),
    check('image', 'Image is required').not().isEmpty(),
    check('image', 'Invalid image URL').isURL(),
    check('role').custom(existsRole),
    validateFields
  ],
  (req, res, next) => {
    const roleService = new RoleService()
    const providerService = new ProviderService(roleService)
    const providerController = new ProviderController(providerService)
    providerController.createProvider(req, res, next)
  }
)

router.put(
  '/:id',
  [
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(existsProviderById),
    check('role').custom(existsRole),
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is required').not().isEmpty(),
    check('email', 'Invalid email').isEmail(),
    validateFields
  ],
  (req, res, next) => {
    const roleService = new RoleService()
    const providerService = new ProviderService(roleService)
    const providerController = new ProviderController(providerService)
    providerController.updateProvider(req, res, next)
  }
)

router.delete(
  '/:id',
  [
    validateJwt,
    haveRole('ADMIN_ROLE'),
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(existsProviderById),
    validateFields
  ],
  (req, res, next) => {
    const roleService = new RoleService()
    const providerService = new ProviderService(roleService)
    const providerController = new ProviderController(providerService)
    providerController.deleteProvider(req, res, next)
  }
)

module.exports = router
