const bcryptjs = require('bcryptjs')
const { generarJWT } = require('../helpers/generarJWT.JS')

const Usuario = require('../models/usuario')
const { Bodega } = require('../models')

const getUsers = async (req, res) => {
  const { limit = 10, desde = 0 } = req.query

  const [total, usuario] = await Promise.all([
    Usuario.countDocuments({ estado: true }),
    Usuario.find({ estado: true }).skip(Number(desde)).limit(Number(limit))
  ])

  res.json({
    usuario,
    total
  })
}

const getUsersPositions = async (req, res) => {
  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments({ estado: true }),
    Usuario.find({ estado: true })
  ])

  const user = []

  usuarios.forEach((usuario) => {
    user.push({
      id: usuario.id,
      nombre: usuario.nombre,
      longitud: usuario.longitud,
      latitud: usuario.latitud
    })
  })

  res.json({
    user,
    total
  })
}

const updateUser = async (req, res) => {
  const id = req.params.id
  const { _id, password, google, correo, ...resto } = req.body

  if (password) {
    const salt = bcryptjs.genSaltSync()
    resto.password = bcryptjs.hashSync(password, salt)
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto, { new: true })

  res.json({
    usuario
  })
}

const createUser = async (req, res) => {
  const { nombre, correo, password, rol, img } = req.body
  const usuario = new Usuario({ nombre, correo, password, rol, img })

  const salt = bcryptjs.genSaltSync()
  usuario.password = bcryptjs.hashSync(password, salt)

  await usuario.save()

  const token = await generarJWT(usuario.uid)

  res.json({
    ok: true,
    token,
    usuario
  })
}

const usuariosPath = (req, res) => {
  res.json({
    ok: true,
    msg: 'PATCH API'
  })
}

const deleteUser = async (req, res) => {
  const { id } = req.params
  const userDesactived = await Usuario.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  )
  const user = req.usuario

  res.json({
    ok: true,
    message: 'Usuario desactivado',
    id,
    userDesactived,
    user
  })
}

const datosDelaBodegaByIdUser = async (req, res) => {
  try {
    const { id } = req.params
    const bodega = await Bodega.find({ usuario: id, estado: true })

    if (bodega.length === 0) {
      return res.status(400).json({
        success: false,
        msg: 'No existe la bodega'
      })
    }

    res.json({
      ok: true,
      bodega
    })
  } catch (error) {
    res.json({
      ok: false,
      error
    })
  }
}

const changePassword = async (req, res) => {
  try {
    const user = req.usuario
    const { oldPassword, newPassword } = req.body

    const usuario = await Usuario.findById(user.id)

    const validPassword = bcryptjs.compareSync(oldPassword, usuario.password)
    if (!validPassword) {
      return res.status(400).json({
        success: false,
        msg: 'Password incorrectos'
      })
    }

    const salt = bcryptjs.genSaltSync()
    const passwordEncriptado = bcryptjs.hashSync(newPassword, salt)

    await Usuario.findByIdAndUpdate(
      user.id,
      { password: passwordEncriptado },
      { new: true }
    )

    res.json({
      success: true,
      msg: 'Contraseña cambiada'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error al cambiar contraseña, hable con el administrador',
      error
    })
  }
}

module.exports = {
  getUsers,
  updateUser,
  createUser,
  usuariosPath,
  deleteUser,
  getUsersPositions,
  datosDelaBodegaByIdUser,
  changePassword
}
