const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const orderSchema = new Schema({
  order_id: { type: String, required: true },
  customer: { type: String, required: true },
  orderStatus: { type: String, required: true },
  paymentIntentId: { type: String, required: true },
  paymentStatus: { type: String, required: true },
  stripeAmountPaid: Number,
  dateCreated: Date,
  datePaid: Date,
  dateAccepted: Date,
  dateDispatched: Date,
  delivery: String,
  extraInfo: String,
  orderItems: { type: [String], required: true },
  refunds: { type: [String], required: true }
});

module.exports = model('Order', orderSchema);
