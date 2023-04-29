exports = async function ({ category, offset = 0, limit = 10 }) {
  try {
    const dbName = context.values.get('DATABASE_NAME');
    const db = context.services
      .get('mongodb-atlas')
      .db(dbName);

    return db.collection('products').aggregate([
      {
        $match: { category }
      }, {
        $skip: offset
      }, {
        $limit: limit
      }
    ]).toArray();
  } catch (err) {
    console.log('[db_offsetProducts] Failed', err);
  }
};
