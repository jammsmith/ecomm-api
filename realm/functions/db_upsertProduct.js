exports = async function (update) {
  console.log("db_updateProduct input id's:", update._id, update.product_id)

  const dbName = context.values.get('DATABASE_NAME')
  const db = context.services.get('mongodb-atlas').db(dbName)

  const products = db.collection('products')
  const subCategories = db.collection('subcategories')

  try {
    // get the existing product or create new one
    let upsertedProduct = {}
    let existingProduct = {}

    try {
      if (update._id) {
        existingProduct = await products.findOne({ _id: update._id })
        console.log('existingProduct._id', existingProduct._id)

        const changedFields = {}
        for (const field in update) {
          if (update[field] !== existingProduct[field]) {
            changedFields[field] = update[field]
          }
        }
        // make sure _id and product_id aren't in changed fields
        if (changedFields._id) delete changedFields._id
        if (changedFields.product_id) delete changedFields.product_id

        if (!Object.keys(changedFields).length) {
          return
        }

        console.log('changedFields num:', Object.keys(changedFields).length)
        // update the product document
        upsertedProduct = await products.findOneAndUpdate(
          { _id: update._id },
          { $set: changedFields },
          { returnNewDocument: true }
        )
      } else {
        const { insertedId } = await products.insertOne(update)

        upsertedProduct = await products.findOneAndUpdate(
          { _id: insertedId },
          {
            $set: {
              path: `/shop/${update.category.toLowerCase()}/${insertedId}`,
            },
          },
          { returnNewDocument: true }
        )
        console.log('Created new product. _id:', insertedId)
      }
    } catch {
      console.log('Failed to upsert product')
    }

    // Update the product relations (only if subcategory has changed)
    if (existingProduct.subCategory !== upsertedProduct.subCategory) {
      try {
        const targetSubCategory = await subCategories.findOne({
          $and: [{ name: update.subCategory }, { category: update.category }],
        })
        const isNewItem = Object.keys(existingProduct).length === 0

        await context.functions.execute(
          'db_updateRelations',
          update.product_id,
          'subcategories',
          targetSubCategory._id,
          'products',
          isNewItem
        )
      } catch {
        console.log('Failed to update product relations')
      }
    }

    return upsertedProduct
  } catch (err) {
    console.log(err)
  }
}
