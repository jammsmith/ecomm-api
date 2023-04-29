const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const refundSchema = new Schema({
  refund_id: { type: String, required: true },
  amount: { type: String, required: true },
  date: { type: Date, required: true },
  reason: { type: String, required: true },
  status: { type: String, required: true }
});

module.exports = model('Refund', refundSchema);
