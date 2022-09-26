const { Router } = require('express')
const { check } = require('express-validator')

const { esRoleValido, emailExiste, existeUsuariPorId } = require('../helpers/db-validators')

const {
  getUsers,
  updateUser,
  usuariosPath,
  deleteUser,
  createUser,
  getUsersPositions,
  datosDelaBodegaByIdUser,
  changePassword
} = require('../controllers/usuarios')

const {
  validarJWT,
  tieneRole,
  validarCampos
} = require('../middlewares')

const router = Router()

router.get('/', getUsers)

router.put('/:id',
  [
    check('id', 'El id del usuario no es ID valido').isMongoId(),
    check('id').custom(existeUsuariPorId),
    check('rol', 'El rol es obligatorio').not().isEmpty(),
    check('nombre', 'El rol es obligatorio').not().isEmpty(),
    check('correo', 'El rol es obligatorio').not().isEmpty(),
    check('rol').custom(esRoleValido),
    validarCampos
  ],
  updateUser)

router.post('/',
  [
    check('correo', 'correo no es valido').isEmail(),
    check('correo').custom(emailExiste),
    check('nombre', 'Nombre es necesario').not().isEmpty(),
    check('password', 'La contraseña debe de tener 6 letras como minimo').isLength({ min: 6 }),
    check('img', 'La imagen es requerida').not().isEmpty(),
    // check('rol', 'No es un rol valido' ).isIn( ["ADMI_ROLE","USER_ROLE"] ),
    check('rol').custom(esRoleValido),
    validarCampos
  ],
  createUser)

router.delete('/:id',
  [
    validarJWT,
    // esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'El id del usuario no es ID valido').isMongoId(),
    check('id').custom(existeUsuariPorId),
    validarCampos

  ], deleteUser)

router.patch('/', usuariosPath)

router.get('/ubicacion', getUsersPositions)

router.post('/datosBodega/:id',
  [
    validarJWT,
    check('id', 'El id del usuario no es ID valido').isMongoId(),
    check('id').custom(existeUsuariPorId),
    validarCampos
  ],
  datosDelaBodegaByIdUser)

router.post('/changePassword',
  [
    validarJWT,
    check('newPassword', 'La nueva contraseña debe de tener 6 letras como minimo').isLength({ min: 6 }),
    validarCampos
  ],
  changePassword)

module.exports = router
