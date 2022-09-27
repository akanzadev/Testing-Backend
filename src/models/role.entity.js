const mongoose = require('mongoose')

const RoleSchema = mongoose.Schema({
  name: {
    type: String,
    enum: ['ADMIN_ROLE', 'USER_ROLE'],
    require: [true, 'Name is required']
  },
  description: {
    type: String,
    require: [true, 'Description is required']
  },
  status: {
    type: Boolean,
    default: true
  }
})

module.exports = mongoose.model('Role', RoleSchema)
