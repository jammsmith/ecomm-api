const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const subCategorySchema = new Schema({
  subCategory_id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  path: { type: String, required: true },
  category: { type: String, required: true },
  products: { type: [String], required: true }
});

module.exports = model('SubCategory', subCategorySchema);
