const { Router } = require('express')
const { check } = require('express-validator')
const {
  existsCategory,
  categoryIsActive,
  existsProductsWithCategory
} = require('../helpers/db-validators')
const { validateJwt, validateFields, haveRole } = require('../middlewares')

const { UserService } = require('../services/user.service')
const { CategoryService } = require('../services/category.service')
const { CategoryController } = require('../controllers/category.controller')

const router = Router()

const userService = new UserService()
const categoryService = new CategoryService(userService)
const categoryController = new CategoryController(categoryService)

router.get('/', categoryController.getCategories)

router.get(
  '/:id',
  [
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(existsCategory),
    validateFields
  ],
  categoryController.getCategory
)

router.post(
  '/',
  [
    validateJwt,
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    validateFields
  ],
  categoryController.createCategory
)

router.put(
  '/:id',
  [
    validateJwt,
    check('id', 'Invalid ID').isMongoId(),
    check('description', 'Description is required').not().isEmpty(),
    check('id').custom(existsCategory),
    validateFields
  ],
  categoryController.updateCategory
)

router.delete(
  '/:id',
  [
    validateJwt,
    haveRole('ADMIN_ROLE'),
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(existsCategory),
    check('id').custom(categoryIsActive),
    check('id').custom(existsProductsWithCategory),
    validateFields
  ],
  categoryController.deleteCategory
)

module.exports = router
