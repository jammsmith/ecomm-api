exports = async (name) => {
  const dbName = context.values.get('DATABASE_NAME');
  const products = context.services
    .get('mongodb-atlas')
    .db(dbName)
    .collection('products');

  try {
    const searchParams = name ? { name: { $regex: name, $options: '$i' } } : {};
    // find all products that contain the name input regardless of capitalisation
    const searchResults = await products.find(searchParams).toArray();

    return JSON.parse(JSON.stringify(searchResults));
  } catch (err) {
    console.log(err);
  }
};
