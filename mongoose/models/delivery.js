const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const deliverySchema = new Schema({
  delivery_id: { type: String, required: true },
  address: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  postcode: { type: String, required: true },
  price: { type: Number, required: true }
});

module.exports = model('Delivery', deliverySchema);
