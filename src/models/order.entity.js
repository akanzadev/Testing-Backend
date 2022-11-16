const mongoose = require('mongoose')

const OrderSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OrderItem',
      required: [true, 'Order Entity is required']
    }
  ],
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider',
    required: [true, 'Provider is required']
  },
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
