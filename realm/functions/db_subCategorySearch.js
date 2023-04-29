exports = async (name) => {
  const dbName = context.values.get('DATABASE_NAME');
  const subCategories = context.services
    .get('mongodb-atlas')
    .db(dbName)
    .collection('subcategories');

  try {
    const searchParams = name ? { name: { $regex: name, $options: '$i' } } : {};
    // find all products that contain the name input regardless of capitalisation
    const searchResults = await subCategories.find(searchParams).toArray();

    return JSON.parse(JSON.stringify(searchResults));
  } catch (err) {
    console.log(err);
  }
};
