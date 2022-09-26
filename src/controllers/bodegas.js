const { response } = require('express')

const { Bodega, Producto } = require('../models')

const crearbodega = async (req, res = response) => {
  try {
    const { estado, usuario, email, ...body } = req.body
    const nombre = req.body.nombre.toUpperCase()

    const bodegaBD = await Bodega.findOne({ nombre })

    if (bodegaBD) {
      return res.status(400).json({
        success: false,
        msg: ' El nombre de la bodega ya existe'
      })
    }

    const dos = await Bodega.findOne({ email })

    if (dos) {
      return res.status(400).json({
        success: false,
        msg: ' El email de la bodega ya existe'
      })
    }

    const data = {
      ...body,
      nombre,
      email,
      usuario: req.usuario._id,
      estado: true
    }

    const bodega = new Bodega(data)
    bodega.save()

    res.status(201).json({
      success: true,
      msg: 'Bodega creada correctamente',
      bodega
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'No se pudo crear bodega, Comuniquese con el administrador'
    })
  }
}

const getBodegas = async (req, res = response) => {
  try {
    const bodegas = await Bodega.find({ estado: true })
    res.json({
      success: true,
      bodegas
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'No se pudo obtener bodegas, Comuniquese con el administrador'
    })
  }
}

const getBodegaById = async (req, res = response) => {
  try {
    const { id } = req.params
    const bodega = await Bodega.findOne({ _id: id, estado: true })
    res.json({
      success: true,
      bodega
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'No se pudo obtener bodega, Comuniquese con el administrador'
    })
  }
}

const updateBodega = async (req, res = response) => {
  try {
    const { id } = req.params
    const { estado, usuario, email, ...body } = req.body
    const nombre = req.body.nombre.toUpperCase()
    const existeNombre = await Bodega.findOne({ nombre })
    if (!!existeNombre && existeNombre._id !== id) {
      return res.status(400).json({
        success: false,
        msg: ' El nombre de la bodega ya existe'
      })
    }

    const bodegaBD = await Bodega.findById(id)
    if (!bodegaBD) {
      return res.status(400).json({
        success: false,
        msg: ' No existe la bodega'
      })
    }
    const dos = await Bodega.findOne({ email })
    if (!!dos && dos._id !== id) {
      return res.status(400).json({
        success: false,
        msg: ' El email de la bodega ya existe'
      })
    }
    const data = {
      ...body,
      nombre,
      email
      // usuario: req.usuario._id,
    }
    const bodega = await Bodega.findByIdAndUpdate(id, data, { new: true })
    res.json({
      success: true,
      msg: 'Bodega actualizada correctamente',
      bodega
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'No se pudo actualizar bodega, Comuniquese con el administrador'
    })
  }
}

const deleteBodega = async (req, res = response) => {
  try {
    const { id } = req.params
    const bodega = await Bodega.findById(id)
    if (!bodega) {
      return res.status(400).json({
        success: false,
        msg: ' No existe la bodega'
      })
    }

    await Bodega.findByIdAndUpdate(id, { estado: false }, { new: true })

    res.status(200).json({
      success: true,
      msg: 'Bodega eliminada correctamente'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'No se pudo eliminar bodega, Comuniquese con el administrador'
    })
  }
}

const obtenerProductoByIdBodega = async (req, res = response) => {
  try {
    const { id } = req.params
    const bodega = await Bodega.findById(id)
    if (!bodega) {
      return res.status(400).json({
        success: false,
        msg: ' No existe la bodega'
      })
    }

    const productos = await Producto.find({
      usuario: bodega.usuario,
      estado: true
    })

    // agregar bodega a cada producto
    const productoConBodega = await Promise.all(productos)
      .then((productos) => {
        return productos.map(async (producto) => {
          const bodega = await Bodega.findOne({ usuario: producto.usuario })
          return { ...producto._doc, bodega }
        })
      })
      .then(async (productos) => {
        return Promise.all(productos)
      })

    res.status(200).json({
      success: true,
      productos: productoConBodega
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'No se pudo obtener productos de la bodega, Comuniquese con el administrador'
    })
  }
}

const obtenerBodegaByIdUsuario = async (req, res = response) => {
  try {
    const { id } = req.params
    const bodega = await Bodega.findOne({ usuario: id, estado: true })
    if (!bodega) {
      return res.status(400).json({
        success: false,
        msg: ' No existe la bodega'
      })
    }

    res.status(200).json({
      success: true,
      bodega
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'No se pudo obtener bodega, Comuniquese con el administrador'
    })
  }
}

module.exports = {
  crearbodega,
  getBodegas,
  getBodegaById,
  updateBodega,
  deleteBodega,
  obtenerProductoByIdBodega,
  obtenerBodegaByIdUsuario
}
