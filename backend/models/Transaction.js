const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  transactionType: { type: String, enum: ['Buy', 'Rent', 'Exchange'], required: true },
  paymentMethod: { type: String, enum: ['Coins', 'Money'], required: true }, //Coins ony for rentals
  amount: { type: Number },
  tokenAmount: { type: Number },
  rentalDuration: { type: String },
  exchangeData: { type: mongoose.Schema.Types.ObjectId, ref: 'ExchangeRequest', },
  status: { type: String, enum: ['Pending', 'Completed', 'Rejected' ], default: 'Pending' },// the pending and rejected ony for exchange 
  transactionHash: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TransactionSchema);