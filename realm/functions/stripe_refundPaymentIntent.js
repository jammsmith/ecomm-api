exports = async (
  paymentIntentId,
  stripeAmount,
  amount,
  reason,
  isFullRefund
) => {
  /** Mongodb Realm has an ongoing problem with the stripe SDK which makes it run VERY slowly.
  Using Axios instead to perform stripe requests. **/
  const axios = require('axios').default;
  const qs = require('qs');
  const secretKey = context.values.get('STRIPE_SK');

  const dbName = context.values.get('DATABASE_NAME');
  const db = context.services
    .get('mongodb-atlas')
    .db(dbName);

  try {
    // remove decimal place for stripe (12.77 should be 1277)
    const params = {
      payment_intent: paymentIntentId,
      amount: stripeAmount,
      reason
    };
    const stringifiedParams = qs.stringify(params);

    const refund = await axios.post(
      'https://api.stripe.com/v1/refunds',
      stringifiedParams,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          contentType: 'application/x-www-form-urlencoded'
        }
      }
    );
    // create a refund in the db
    const timestamp = new Date(Date.now());

    await db.collection('refunds').insertOne({
      refund_id: refund.data.id,
      status: refund.data.status,
      amount,
      reason,
      date: timestamp
    });
    const dbRefund = await db
      .collection('refunds')
      .findOne({ refund_id: refund.data.id });

    // update the order
    const orderUpdate = { dateRefunded: timestamp };
    if (isFullRefund) {
      orderUpdate.paymentStatus = 'refunded';
    }
    await db.collection('orders').updateOne(
      { paymentIntentId },
      {
        $set: orderUpdate,
        $push: { refunds: refund.data.id }
      }
    );

    const shallowParsed = JSON.parse(JSON.stringify(dbRefund));
    const amountParsed = JSON.parse(JSON.stringify(shallowParsed.amount));

    return { ...shallowParsed, amount: amountParsed };
  } catch (err) {
    return err;
  }
};
