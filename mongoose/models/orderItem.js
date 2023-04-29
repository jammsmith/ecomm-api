const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const orderItemSchema = new Schema({
  orderItem_id: { type: String, required: true },
  quantity: { type: Number, required: true },
  info: String,
  product: { type: String, required: true },
  order: { type: String, required: true }
});

module.exports = model('OrderItem', orderItemSchema);
