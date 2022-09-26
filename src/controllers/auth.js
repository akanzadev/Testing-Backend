const { response, request } = require('express')
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario')
const { generarJWT } = require('../helpers/generarJWT.JS')
const { googleVerify } = require('../helpers/google-verify')

const login = async (req = request, res = response) => {
  const { correo, password } = req.body

  try {
    const usuario = await Usuario.findOne({ correo })

    if (!usuario) {
      return res.status(400).json({
        msg: 'Usuario / Password incorrectos - correo',
        correo
      })
    }

    if (!usuario.estado) {
      return res.status(400).json({
        msg: 'Usuario / Password incorrectos - estado - false',
        correo
      })
    }

    const validPassword = bcryptjs.compareSync(password, usuario.password)
    if (!validPassword) {
      return res.status(400).json({
        msg: 'Usuario / Password incorrectos - password',
        correo
      })
    }

    const token = await generarJWT(usuario.id)

    return res.json({
      msg: 'Login',
      correo,
      token,
      usuario
    })
  } catch (error) {
    return res.status(500).json({
      msg: 'Hable con el Admi'
    })
  }
}

const googleSignin = async (req = request, res = response) => {
  const { id_token } = req.body
  try {
    const { correo, nombre, img } = await googleVerify(id_token)
    let usuario = await Usuario.findOne({ correo })
    if (!usuario) {
      const data = {
        nombre,
        correo,
        password: ':p',
        img,
        google: true
      }

      usuario = new Usuario(data)
      await usuario.save()
    }

    if (!usuario.estado) {
      return res.status(401).json({
        msg: 'Hbale con el administrador, usuario bloqueado'
      })
    }
    const a = usuario.id

    const token = await generarJWT(usuario.uid)

    return res.status(200).json({
      msg: 'Todo ok! , miau',
      id_token,
      token,
      usuario,
      a
    })
  } catch (error) {
    return res.status(400).json({
      msg: 'Token de Google no es valido',
      id_token
    })
  }
}

const RenovarJWT = async (req = request, res = response) => {
  const usuario = req.usuario

  try {
    const token = await generarJWT(usuario.id)

    res.json({
      token,
      usuario
    })
  } catch (error) {
    return res.status(500).json({
      msg: 'Hable con el Admi'
    })
  }
}

module.exports = {
  login,
  googleSignin,
  RenovarJWT
}
