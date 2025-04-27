const mongoose = require('mongoose');
const Transaction = require('./Transaction');

const ExchangeRequestSchema = new mongoose.Schema({
  initiator: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  initiatorCode: { type: String, required: true },
  receiverCode: { type: String },
  Transaction: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', required: true },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date }
});

module.exports = mongoose.model('ExchangeRequest', ExchangeRequestSchema);