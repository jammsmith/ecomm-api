const { faker } = require('@faker-js/faker')

const categories = require('../sampleData/categories.js')
const subCategories = require('../sampleData/subCategories.js')

const generateCategories = (products) => {
  const generatedCategories = categories.map((category) => {
    const subCategoriesInCategory = subCategories.filter(
      (item) => item.category === category.name
    )
    const subCategoryIds = subCategoriesInCategory.map(
      (item) => item.subCategory_id
    )

    return {
      category_id: category.category_id,
      name: category.name,
      description: faker.commerce.productDescription(),
      image: 'https://via.placeholder.com/300',
      subCategories: subCategoryIds,
      products: products
        .filter((p) => p.category === category.name)
        .map((p) => p.product_id),
      path: category.path,
    }
  })
  return generatedCategories
}

module.exports = generateCategories
