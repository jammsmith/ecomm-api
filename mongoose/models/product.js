const mongoose = require('mongoose')

const { Schema, model } = mongoose

const productSchema = new Schema({
  product_id: { type: String, required: true },
  name: { type: String, required: true },
  images: { type: [String], required: true },
  category: { type: String, required: true },
  subCategory: { type: String },
  description: { type: String, required: true },
  path: { type: String, required: true },
  priceGBP: { type: Number, required: true },
  priceUSD: { type: Number, required: true },
  priceEUR: { type: Number, required: true },
  numInStock: { type: Number, required: true, default: 0 },
  deliveryLevel: { type: Number, required: true },
  // isFeatured: { type: Boolean, required: true, default: false },
  // isLive: { type: Boolean, required: true, default: false },
})

module.exports = model('Product', productSchema)
