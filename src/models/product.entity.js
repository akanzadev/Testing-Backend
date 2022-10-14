const mongoose = require('mongoose')

const ProductSchema = mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Name is required'],
    unique: true
  },
  img: {
    type: String,
    default: 'https://apply.sts.net.pk/assets/images/default-upload-image.jpg'
  },
  description: { type: String, require: [true, 'Description is required'] },
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

ProductSchema.methods.toJSON = function () {
  const { __v, estado, ...data } = this.toObject()

  return data
}

module.exports = mongoose.model('Product', ProductSchema)
