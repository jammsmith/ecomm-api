const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const addressSchema = new Schema({
  address_id: { type: String, required: true },
  line1: { type: String, required: true },
  line2: String,
  city: { type: String, required: true },
  county: { type: String, required: true },
  postcode: { type: String, required: true },
  country: { type: String, required: true },
  isDefault: { type: Boolean, required: true, default: false }
});

module.exports = model('Address', addressSchema);
