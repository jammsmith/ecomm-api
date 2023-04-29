exports = async function (userId) {
  const dbName = context.values.get('DATABASE_NAME');
  const db = context.services
    .get('mongodb-atlas')
    .db(dbName);

  try {
    const user = await db.collection('users').findOne({ _id: BSON.ObjectId(userId) });

    if (!user) return;

    user.addresses = user.addresses && user.addresses.length &&
      await db.collection('addresses')
        .find({ address_id: { $in: user.addresses } })
        .toArray();

    user.orders = await db.collection('orders')
      .find({ customer: user.user_id })
      .sort({ dateCreated: -1 })
      .toArray();

    for (let i = 0; i < user.orders.length; i++) {
      const order = user.orders[i];

      const orderItems = db.collection('orderitems')
        .find({ order: order.order_id })
        .toArray()
        .then(async items => {
          for (let i = 0; i < items.length; i++) {
            const product = await db.collection('products').findOne({ product_id: items[i].product });
            items[i].product = product;
          }
          return items;
        });

      order.orderItems = await Promise.resolve(orderItems);
    }

    return JSON.parse(JSON.stringify(user));
  } catch (err) {
    console.log(err);
  }
};
