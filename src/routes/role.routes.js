const { Router } = require('express')
const { check } = require('express-validator')

const { existsRoleById } = require('../helpers')
const { validateJwt, validateFields, haveRole } = require('../middlewares')

const { RoleService } = require('../services')
const { RoleController } = require('../controllers')

const router = Router()

router.get('/', (req, res, next) => {
  const roleService = new RoleService()
  const roleController = new RoleController(roleService)
  roleController.getRoles(req, res, next)
})

router.get(
  '/:id',
  [
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(existsRoleById),
    validateFields
  ],
  (req, res, next) => {
    const roleService = new RoleService()
    const roleController = new RoleController(roleService)
    roleController.getRole(req, res, next)
  }
)

router.post(
  '/',
  [
    // validateJwt,
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    validateFields
  ],
  (req, res, next) => {
    const roleService = new RoleService()
    const roleController = new RoleController(roleService)
    roleController.createRole(req, res, next)
  }
)

router.put(
  '/:id',
  [
    validateJwt,
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(existsRoleById),
    validateFields
  ],
  (req, res, next) => {
    const roleService = new RoleService()
    const roleController = new RoleController(roleService)
    roleController.updateRole(req, res, next)
  }
)

router.delete(
  '/:id',
  [
    validateJwt,
    haveRole('ADMIN_ROLE'),
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(existsRoleById),
    validateFields
  ],
  (req, res, next) => {
    const roleService = new RoleService()
    const roleController = new RoleController(roleService)
    roleController.deleteRole(req, res, next)
  }
)

module.exports = router
