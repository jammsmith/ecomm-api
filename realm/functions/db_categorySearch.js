exports = async (name) => {
  try {
    const dbName = context.values.get('DATABASE_NAME');
    const categories = context.services
      .get('mongodb-atlas')
      .db(dbName)
      .collection('categories');

    const searchParams = name ? { name: { $regex: name, $options: '$i' } } : {};
    // find all products that contain the name input regardless of capitalisation
    const searchResults = await categories.find(searchParams).toArray();

    return JSON.parse(JSON.stringify(searchResults));
  } catch (err) {
    console.log(err);
  }
};
