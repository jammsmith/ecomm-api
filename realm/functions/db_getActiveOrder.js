exports = async function (userId) {
  const dbName = context.values.get('DATABASE_NAME');
  const db = context.services
    .get('mongodb-atlas')
    .db(dbName);

  try {
    // Get the order thats still pending in cart for the customer id
    const order = await db.collection('orders').findOne({
      $and: [
        { customer: userId },
        { orderStatus: 'pendingInCart' }
      ]
    });

    if (!order) return null;

    // Get the order items for the order
    const orderItems = await db.collection('orderitems')
      .find({ order: order.order_id })
      .toArray();

    // Get the products for each order item and replace id's in the product array with actual product objects
    for (const item of orderItems) {
      const product = await db.collection('products').findOne({
        product_id: item.product
      });

      item.product = product;
    }

    // Replace ids in order item array with actual order item objects
    order.orderItems = orderItems;

    return JSON.parse(JSON.stringify(order));
  } catch (err) {
    console.log(err);
  }
};
