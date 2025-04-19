const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  transactionType: { type: String, enum: ['Buy', 'Rent', 'Exchange'], required: true },
  paymentMethod: { type: String, enum: ['Token', 'Exchange'], required: true },
  amount: { type: Number, required: true },
  tokenAmount: { type: Number },
  rentalDuration: { type: String },
  exchangeData: { type: mongoose.Schema.Types.ObjectId, ref: 'ExchangeRequest', },
  status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
  transactionHash: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TransactionSchema);