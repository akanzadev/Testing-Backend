const mongoose = require('mongoose')

const BrandSchema = mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Name is required'],
    unique: true
  },
  description: {
    type: String,
    require: [true, 'Description is required']
  },
  status: {
    type: Boolean,
    default: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

BrandSchema.methods.toJSON = function () {
  const { __v, status, ...rest } = this.toObject()
  return rest
}

module.exports = mongoose.model('Brand', BrandSchema)
