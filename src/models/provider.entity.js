const mongoose = require('mongoose')

const ProviderSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: [true, 'Email already exists']
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  image: {
    type: String,
    default: 'https://apply.sts.net.pk/assets/images/default-upload-image.jpg'
  },
  phone: {
    type: Number,
    default: 0
  },
  status: {
    type: Boolean,
    default: true
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Role'
  }
})

ProviderSchema.methods.toJSON = function () {
  const { _id, __v, ...rest } = this.toObject()
  rest.uuid = _id
  return rest
}

module.exports = mongoose.model('Provider', ProviderSchema)
