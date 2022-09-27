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

const userService = new UserService()
const brandService = new BrandService(userService)
const brandController = new BrandController(brandService)

router.get('/', brandController.getBrands)

router.get(
  '/:id',
  [
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(existsBrand),
    validateFields
  ],
  brandController.getBrand
)

router.post(
  '/',
  [
    validateJwt,
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    validateFields
  ],
  brandController.createBrand
)

router.put(
  '/:id',
  [
    validateJwt,
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(existsBrand),
    validateFields
  ],
  brandController.updateBrand
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
  brandController.deleteBrand
)

module.exports = router
