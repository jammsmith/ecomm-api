exports = async function (subCategoryId) {
  console.log('subCategory_id:', subCategoryId);
  try {
    const dbName = context.values.get('DATABASE_NAME');
    const db = context.services
      .get('mongodb-atlas')
      .db(dbName);

    const subCategories = db.collection('subcategories');
    const categories = db.collection('categories');

    const deleteSubCategory = async () => {
      try {
        return await subCategories.deleteOne({ subCategory_id: subCategoryId });
      } catch (err) {
        return err;
      }
    };

    const removeFromExistingRelationArray = async () => {
      try {
        const existingCategory = await categories.findOne(
          { subCategories: { $in: [subCategoryId] } }
        );
        console.log('existingCategory.name', existingCategory.name);

        const updatedSubCategoryArray = existingCategory.subCategories.filter(subCategory => subCategory !== subCategoryId);
        console.log('updatedSubCategoryArray', updatedSubCategoryArray);

        const removed = await categories.findOneAndUpdate(
          { subCategories: subCategoryId },
          {
            $set: { subCategories: updatedSubCategoryArray }
          },
          { returnNewDocument: true }
        );
        return removed.subCategories;
      } catch (err) {
        return err;
      }
    };

    const result = await deleteSubCategory();
    console.log('result.deletedCount', result.deletedCount);

    if (result.deletedCount === 1) {
      await removeFromExistingRelationArray();
      return {
        subCategoryId,
        isDeleted: true
      };
    } else {
      return {
        subCategoryId,
        isDeleted: false
      };
    }
  } catch (err) {
    console.log(err);
  }
};
