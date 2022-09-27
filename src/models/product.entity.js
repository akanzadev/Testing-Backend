const mongoose = require('mongoose')

const ProductoSchema = mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Name is required'],
    unique: true
  },
  img: { type: String },
  descripcion: { type: String },
  price: {
    type: Number,
    default: 0
  },
  stock: {
    type: Number,
    default: 0,
    required: [true, 'El stock es obligatorio']
  },
  status: {
    type: Boolean,
    default: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: [true, 'Brand is required']
  }
})

ProductoSchema.methods.toJSON = function () {
  const { __v, estado, ...data } = this.toObject()

  return data
}

module.exports = mongoose.model('Producto', ProductoSchema)
