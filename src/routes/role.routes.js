const { Router } = require('express')
const { check } = require('express-validator')

const { existsRoleById } = require('../helpers')
const { validateJwt, validateFields, haveRole } = require('../middlewares')

const { RoleService } = require('../services/role.service')
const { RoleController } = require('../controllers/role.controller')

const roleService = new RoleService()
const roleController = new RoleController(roleService)

const router = Router()

router.get('/', roleController.getRoles)

router.get('/:id',
  [
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(existsRoleById),
    validateFields
  ]
  , roleController.getRole)

router.post('/',
  [
    validateJwt,
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    validateFields
  ]
  , roleController.createRole)

router.put('/:id',
  [
    validateJwt,
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(existsRoleById),
    validateFields
  ]
  , roleController.updateRole)

router.delete('/:id',
  [
    validateJwt,
    haveRole('ADMIN_ROLE'),
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(existsRoleById),
    validateFields
  ]
  , roleController.deleteRole)

module.exports = router
