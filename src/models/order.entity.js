const mongoose = require('mongoose')

const OrderSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product is required']
  }],
  status: {
    type: Boolean,
    default: true
  }
})

OrderSchema.methods.toJSON = function () {
  const { __v, status, ...data } = this.toObject()
  return data
}

module.exports = mongoose.model('Order', OrderSchema)
