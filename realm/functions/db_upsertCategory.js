exports = async function (update) {
  const dbName = context.values.get('DATABASE_NAME');
  const db = context.services
    .get('mongodb-atlas')
    .db(dbName);

  const categories = db.collection('categories');

  try {
    // get the existing product or create new one
    let upsertedCategory = {};
    let existingCategory = {};

    try {
      if (update._id) {
        existingCategory = await categories.findOne({ _id: update._id });
        console.log('existingCategory._id', existingCategory._id);

        const changedFields = {};
        for (const field in update) {
          if (update[field] !== existingCategory[field]) {
            changedFields[field] = update[field];
          }
        }
        // make sure _id and category_id aren't in changed fields
        if (changedFields._id) delete changedFields._id;
        if (changedFields.category_id) delete changedFields.category_id;

        if (!Object.keys(changedFields).length) {
          return;
        }
        console.log('Number of changed fields:', Object.keys(changedFields).length);

        // update the sub-category document
        upsertedCategory = await categories.findOneAndUpdate(
          { _id: update._id },
          { $set: changedFields },
          { returnNewDocument: true }
        );
      } else {
        const { insertedId } = await categories.insertOne(update);
        upsertedCategory = await categories.findOne({ _id: insertedId });
        console.log('Created new category. _id:', upsertedCategory._id);
      }
    } catch {
      console.log('Failed to upsert sub-category');
    }

    return upsertedCategory;
  } catch (err) {
    console.log(err);
  }
};
