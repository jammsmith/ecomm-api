const mongoose = require('mongoose')

const { Schema, model } = mongoose

const userSchema = new Schema({
  user_id: { type: String, required: true },
  type: { type: String, required: true, default: 'GUEST' },
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  orders: [String],
  addresses: [String],
})

module.exports = model('User', userSchema)
