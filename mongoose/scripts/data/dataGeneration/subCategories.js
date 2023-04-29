const subCategories = require('../sampleData/subCategories.js')

const generateSubCategories = () => {
  let productsStartCount = 1
  const generatedSubCategories = subCategories.map((subCategory) => {
    const generatedProducts = []

    for (let i = productsStartCount; i < productsStartCount + 10; i++) {
      generatedProducts.push(`product-00${i}`)
    }
    productsStartCount = productsStartCount + 10

    subCategory.products = generatedProducts
    return subCategory
  })
  return generatedSubCategories
}

module.exports = generateSubCategories
