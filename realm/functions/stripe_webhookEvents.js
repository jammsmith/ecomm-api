exports = async (payload, response) => {
  // Convert the webhook body from BSON to an EJSON object
  const event = EJSON.parse(payload.body.text());

  // Handle payments
  const dbName = context.values.get('DATABASE_NAME');
  const db = context.services
    .get('mongodb-atlas')
    .db(dbName);

  const orders = db.collection('orders');
  const orderItems = db.collection('orderitems');
  const products = db.collection('products');

  const updateOrderStatus = async (update) => {
    try {
      const updatedOrder = await orders.findOneAndUpdate(
        { paymentIntentId: event.data.object.id },
        { $set: update },
        {
          returnNewDocument: true
        }
      );
      console.log('Updated order in updateOrderStatus', updatedOrder);
      console.log('Updated order_id in updateOrderStatus', updatedOrder.order_id);

      console.log('Updated order keys -------->');
      const updatedOrderKeys = Object.keys(updatedOrder);
      for (const key of updatedOrderKeys) {
        console.log(key);
      }
      return updatedOrder;
    } catch (err) {
      console.log('updateOrderStatus failed:', err);
    }
  };

  const handlePaymentSucceeded = async () => {
    try {
      const { order_id: orderId } = await updateOrderStatus({
        orderStatus: 'awaitingConfirmation',
        paymentStatus: 'successful',
        datePaid: new Date(Date.now()),
        stripeAmountPaid: event.data.object.amount
      });
      console.log('Order updated. order_id:', orderId);

      // get the product quantities and update inventory levels
      const orderedItems = await orderItems.find({ order: orderId }).toArray();
      console.log('Ordered items found. Number of items:', orderedItems.length);

      for (const item of orderedItems) {
        console.log(
          'Attempting to update product quantity for orderItem_id:',
          item.orderItem_id
        );

        const orderedQuantity = parseInt(item.quantity);
        console.log('Quantity of product ordered:', orderedQuantity);

        await products.updateOne(
          { product_id: item.product },
          { $inc: { numInStock: -orderedQuantity } }
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handlePaymentFailed = async () => {
    try {
      await updateOrderStatus({
        paymentStatus: 'failed'
      });
    } catch (err) {
      console.log(err);
    }
  };

  // Handle refunds
  const handleRefundUpdated = async () => {
    try {
      const refunds = db.collection('refunds');
      const refund = event.data.object;

      await refunds.updateOne(
        { refund_id: refund.id },
        {
          $set: { status: refund.status }
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      console.log('payment_intent.succeeded');
      handlePaymentSucceeded();
      break;
    case 'payment_intent.payment_failed':
      console.log('payment_intent.payment_failed');
      handlePaymentFailed();
      break;
    case 'charge.refunded':
    case 'charge.refund.updated':
      console.log('charge.refunded || charge.refund.updated');
      handleRefundUpdated();
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.statusCode = 200;
};
