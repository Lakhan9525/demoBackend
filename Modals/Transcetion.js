
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  walletId: mongoose.Types.ObjectId,
  amount: Number,
  balance: Number,
  description: String,
  date: Date,
  type: String,
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
