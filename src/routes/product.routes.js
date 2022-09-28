const { Router } = require('express')
const { check } = require('express-validator')

const {
  existeCategoria,
  existeProducto,
  existeProductoporId,
  existeProductoPorNombreDeCategoria,
  existsProduct
} = require('../helpers/db-validators')
const { validateFields, validateJwt, haveRole } = require('../middlewares')

const { UserService, BrandService, CategoryService } = require('../services')
const { ProductController } = require('../controllers')

const router = Router()

router.get('/', (req, res, next) => {
  const userService = new UserService()
  const categoryService = new CategoryService(userService)
  const brandService = new BrandService(userService)
  const productController = new ProductController(
    userService,
    categoryService,
    brandService
  )
  productController.getProducts(req, res, next)
})

router.get(
  '/:id',
  [
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(existsProduct),
    validateFields
  ],
  (req, res, next) => {
    const userService = new UserService()
    const categoryService = new CategoryService(userService)
    const brandService = new BrandService(userService)
    const productController = new ProductController(
      userService,
      categoryService,
      brandService
    )
    productController.getProduct(req, res, next)
  }
)

/* router.get(
  '/category/:name',
  [check('name').custom(existeProductoPorNombreDeCategoria), validateFields],
  productController.getProductByCategory
)

router.get(
  '/:name',
  [
    check('nombre', 'El nombre del producto no es valido').not().isEmpty(),
    check('nombre').custom(existeProducto),
    validateFields
  ],
  productController.getProductByName
) */

/* router.get(
  '/user/:id',
  [
    check('id', 'El id del producto no es ID valido').isMongoId(),
    check('id').custom(existeUsuariPorId),
    validateFields
  ],
  productController.getProductByUser
) */

/* router.post(
  '/',
  [
    validateJwt,
    check(
      'categoria',
      'El valor de categoria no es ID valido de mongo'
    ).isMongoId(),
    check('categoria').custom(existeCategoria),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('precio', 'El precio es obligatorio').not().isEmpty(),
    check('descripcion', 'El descripcion es obligatorio').not().isEmpty(),
    validateFields
  ],
  productController.createProduct
)

router.put(
  '/:id',
  [
    validateJwt,
    check('id', 'El id del producto no es ID valido').isMongoId(),
    check('id').custom(existeProducto),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('precio', 'El precio es obligatorio').not().isEmpty(),
    check('descripcion', 'El descripcion es obligatorio').not().isEmpty(),
    validateFields
  ],
  actualizarProducto
) */

router.delete(
  '/:id',
  [validateJwt, haveRole('ADMIN_ROLE'), check('id', 'Invalid ID').isMongoId()],
  (req, res, next) => {
    const userService = new UserService()
    const categoryService = new CategoryService(userService)
    const brandService = new BrandService(userService)
    const productController = new ProductController(
      userService,
      categoryService,
      brandService
    )
    productController.deleteProduct(req, res, next)
  }
)

module.exports = router
