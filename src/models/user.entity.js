const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  image: {
    type: String
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
    ref: 'Role',
    default: 'USER_ROLE'
  }
})

UserSchema.methods.toJSON = function () {
  const { _id, __v, password, ...rest } = this.toObject()
  rest.uid = _id
  return rest
}

module.exports = mongoose.model('User', UserSchema)
