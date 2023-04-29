exports = async function (update) {
  const dbName = context.values.get('DATABASE_NAME');
  const db = context.services
    .get('mongodb-atlas')
    .db(dbName);

  const subCategories = db.collection('subcategories');
  const categories = db.collection('categories');

  try {
    // get the existing product or create new one
    let upsertedSubCategory = {};
    let existingSubCategory = {};

    try {
      if (update._id) {
        existingSubCategory = await subCategories.findOne({ _id: update._id });
        console.log('existingSubCategory._id', existingSubCategory._id);

        const changedFields = {};
        for (const field in update) {
          if (update[field] !== existingSubCategory[field]) {
            changedFields[field] = update[field];
          }
        }
        // make sure _id and subCategory_id aren't in changed fields
        if (changedFields._id) delete changedFields._id;
        if (changedFields.subCategory_id) delete changedFields.subCategory_id;

        if (!Object.keys(changedFields).length) {
          return;
        }
        console.log('Number of changed fields:', Object.keys(changedFields).length);

        // update the sub-category document
        upsertedSubCategory = await subCategories.findOneAndUpdate(
          { _id: update._id },
          { $set: changedFields },
          { returnNewDocument: true }
        );
      } else {
        const { insertedId } = await subCategories.insertOne(update);
        upsertedSubCategory = await subCategories.findOne({ _id: insertedId });
        console.log('Created new sub-category. _id:', upsertedSubCategory._id);
      }
    } catch {
      console.log('Failed to upsert sub-category');
    }

    // Update the product relations (only if subcategory has changed)
    if (existingSubCategory.category !== upsertedSubCategory.category) {
      try {
        const targetCategory = await categories.findOne(
          { name: update.category }
        );
        const isNewItem = Object.keys(existingSubCategory).length === 0;

        await context.functions.execute(
          'db_updateRelations',
          update.subCategory_id,
          'categories',
          targetCategory._id,
          'subCategories',
          isNewItem
        );
      } catch {
        console.log('Failed to update sub-category relations');
      }
    }

    return upsertedSubCategory;
  } catch (err) {
    console.log(err);
  }
};
