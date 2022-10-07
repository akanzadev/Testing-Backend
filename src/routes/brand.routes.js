const { Router } = require('express')
const { check } = require('express-validator')
const {
  existsBrand,
  brandIsActive,
  existsProductsWithBrand
} = require('../helpers')
const { validateJwt, validateFields, haveRole } = require('../middlewares')

const { BrandService, UserService } = require('../services')
const { BrandController } = require('../controllers')

const router = Router()

router.get('/', (req, res, next) => {
  const userService = new UserService()
  const brandService = new BrandService(userService)
  const brandController = new BrandController(brandService)
  brandController.getBrands(req, res, next)
})

router.get(
  '/:id',
  [
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(existsBrand),
    validateFields
  ],
  (req, res, next) => {
    const userService = new UserService()
    const brandService = new BrandService(userService)
    const brandController = new BrandController(brandService)
    brandController.getBrand(req, res, next)
  }
)

router.post(
  '/',
  [
    validateJwt,
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    validateFields
  ],
  (req, res, next) => {
    const userService = new UserService()
    const brandService = new BrandService(userService)
    const brandController = new BrandController(brandService)
    brandController.createBrand(req, res, next)
  }
)

router.put(
  '/:id',
  [
    validateJwt,
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(existsBrand),
    validateFields
  ],
  (req, res, next) => {
    const userService = new UserService()
    const brandService = new BrandService(userService)
    const brandController = new BrandController(brandService)
    brandController.updateBrand(req, res, next)
  }
)

router.delete(
  '/:id',
  [
    validateJwt,
    haveRole('ADMIN_ROLE'),
    check('id', 'El id de la categoria no es ID valido').isMongoId(),
    check('id').custom(existsBrand),
    check('id').custom(brandIsActive),
    check('id').custom(existsProductsWithBrand),
    validateFields
  ],
  (req, res, next) => {
    const userService = new UserService()
    const brandService = new BrandService(userService)
    const brandController = new BrandController(brandService)
    brandController.deleteBrand(req, res, next)
  }
)

module.exports = router
