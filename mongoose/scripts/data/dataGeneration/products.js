const mongoose = require('mongoose')
const { faker } = require('@faker-js/faker')
const _ = require('lodash')

const categories = require('../sampleData/categories.js')

const generateProducts = () => {
  try {
    const generatedProducts = []

    for (let i = 1; i < 100; i++) {
      const numInStockOptions = [0, 1, 2, 3]

      // Returns an array of category names.
      const categoryArray = categories.map((c) => c.name)

      // Returns a single category from the above array.
      const randomCategory = faker.helpers.arrayElement(categoryArray)

      // Returns an object containing the category name and array of sub-categories from the above category.
      const currentCategory = categories.find((c) => randomCategory === c.name)

      // Returns a random subCategory or null if there are no subCategories.
      const randomSubCategory =
        currentCategory &&
        currentCategory.subCategories &&
        currentCategory.subCategories.length
          ? faker.helpers.arrayElement(currentCategory.subCategories)
          : null

      // Returns a random number (1-5) of images
      const images = []
      const numberBetweenOneAndFive = Math.ceil(Math.random() * 5)

      for (let i = 0; i < numberBetweenOneAndFive; i++) {
        const randomId = faker.helpers.arrayElement(
          new Array(100).fill(1).map((_, i) => i + 1)
        )
        images.push(`https://placedog.net/400/400?id=${randomId}`)
      }

      const _id = mongoose.Types.ObjectId()

      generatedProducts.push({
        _id,
        product_id: `product-00${i}`,
        name: faker.commerce.productName(),
        images: images,
        category: randomCategory,
        subCategory: randomSubCategory,
        description: faker.commerce.productDescription(),
        path: `/shop/${_.kebabCase(randomCategory)}/${_id}`,
        priceGBP: faker.commerce.price(),
        priceUSD: faker.commerce.price(),
        priceEUR: faker.commerce.price(),
        numInStock: faker.helpers.arrayElement(numInStockOptions),
        deliveryLevel: faker.helpers.arrayElement([1, 2, 3]),
      })
    }

    return generatedProducts
  } catch (err) {
    throw `[generateProducts] failed. Error: ${err}`
  }
}

module.exports = generateProducts
