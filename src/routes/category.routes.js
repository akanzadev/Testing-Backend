const { Router } = require('express')
const { check } = require('express-validator')
const {
  existsCategory,
  categoryIsActive,
  existsProductsWithCategory
} = require('../helpers/db-validators')
const { validateJwt, validateFields, haveRole } = require('../middlewares')

const { UserService, CategoryService } = require('../services')
const { CategoryController } = require('../controllers')

const router = Router()

router.get('/', (req, res, next) => {
  const userService = new UserService()
  const categoryService = new CategoryService(userService)
  const categoryController = new CategoryController(categoryService)
  categoryController.getCategories(req, res, next)
})

router.get(
  '/:id',
  [
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(existsCategory),
    validateFields
  ],
  (req, res, next) => {
    const userService = new UserService()
    const categoryService = new CategoryService(userService)
    const categoryController = new CategoryController(categoryService)
    categoryController.getCategory(req, res, next)
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
    const categoryService = new CategoryService(userService)
    const categoryController = new CategoryController(categoryService)
    categoryController.createCategory(req, res, next)
  }
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
  (req, res, next) => {
    const userService = new UserService()
    const categoryService = new CategoryService(userService)
    const categoryController = new CategoryController(categoryService)
    categoryController.updateCategory(req, res, next)
  }
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
  (req, res, next) => {
    const userService = new UserService()
    const categoryService = new CategoryService(userService)
    const categoryController = new CategoryController(categoryService)
    categoryController.deleteCategory(req, res, next)
  }
)

module.exports = router
