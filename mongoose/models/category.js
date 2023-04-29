const mongoose = require('mongoose')

const { Schema, model } = mongoose

const categorySchema = new Schema({
  category_id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  subCategories: { type: [String], required: false, default: [] },
  products: { type: [String], required: true },
  path: { type: String, required: true },
})

module.exports = model('Category', categorySchema)
