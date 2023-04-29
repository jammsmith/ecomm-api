exports = async (order) => {
  /** Mongodb Realm has an ongoing problem with the stripe SDK which makes it run VERY slowly.
  Using Axios instead to perform stripe requests. **/
  const axios = require('axios').default;
  const qs = require('qs');

  const secretKey = context.values.get('STRIPE_SK');

  try {
  // Get prices for products and make total to pay
    const subTotal = await context.functions.execute('helper_getOrderSubtotal', order.orderItems, order.currency);

    const purchaseData = {
      amount: subTotal * 100,
      currency: order.currency.toLowerCase(),
      metadata: {
        order_id: order.order_id
      }
    };
    const stringifiedData = qs.stringify(purchaseData);

    const paymentIntent = await axios.post(
      'https://api.stripe.com/v1/payment_intents',
      stringifiedData,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          contentType: 'application/x-www-form-urlencoded'
        }
      }
    );
    return paymentIntent.data;
  } catch (err) {
    console.log('Realm function error -> getPaymentIntent. Error:', err);
    return null;
  }
};
