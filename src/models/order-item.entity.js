const mongoose = require('mongoose')

const OrderItemSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required']
  }
})

OrderItemSchema.methods.toJSON = function () {
  const { __v, status, ...data } = this.toObject()
  return data
}

module.exports = mongoose.model('OrderItem', OrderItemSchema)
