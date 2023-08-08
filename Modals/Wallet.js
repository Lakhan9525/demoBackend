const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  balance: Number,
  name: String,
  date: Date,
});

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;
