const { Category, Product, SubCategory } = require('../models')

const generateCategories = require('./data/dataGeneration/categories.js')
const generateSubCategories = require('./data/dataGeneration/subCategories.js')
const generateProducts = require('./data/dataGeneration/products.js')

const mongooseConnection = require('../client.js')
mongooseConnection()

//
const resetInventory = async () => {
  try {
    // Delete existing data
    await Category.deleteMany()
    await Product.deleteMany()
    await SubCategory.deleteMany()

    // Add shop inventory
    const products = generateProducts()

    const categories = generateCategories(products)

    await Category.insertMany(categories)
    console.log('Categories added successfully.')

    await Product.insertMany(products)
    console.log('Products added successfully.')

    const subCategories = generateSubCategories()
    await SubCategory.insertMany(subCategories)
    console.log('Sub-categories added successfully.')

    console.log('Seed completed successfully.')
    process.exit(0)
  } catch (err) {
    console.error(`Fake data import failed: ${err}`)
    process.exit(1)
  }
}

const deleteInventory = async () => {
  try {
    await SubCategory.deleteMany()
    await Category.deleteMany()
    await Product.deleteMany()

    console.log('Data deletion successful.')
    process.exit(0)
  } catch (err) {
    console.error(`Data deletion failed: ${err}`)
    process.exit(0)
  }
}

if (process.argv[2] === '-d') {
  deleteInventory()
} else {
  resetInventory()
}
