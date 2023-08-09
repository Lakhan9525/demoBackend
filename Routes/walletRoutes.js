const express = require('express');
const Transaction = require('../Modals/Transcetion');
const Wallet = require('../Modals/Wallet');
const router = express.Router();



// API: Setup a new wallet
router.post('/setup', async (req, res) => {
  try {
    const { balance, name } = req.body;

    
    if (balance !== Math.floor(balance * 10000) / 10000) {
      return res.status(400).json({ error: 'Invalid balance value' });
    }

    const wallet = new Wallet({
      balance,
      name,
      date: new Date(),
    });
    await wallet.save();

    const transaction = new Transaction({
      walletId: wallet._id,
      amount: balance,
      balance,
      description: 'Setup',
      date: new Date(),
      type: 'CREDIT',
    });
    await transaction.save();

    res.status(200).json({
      id: wallet._id,
      balance: wallet.balance,
      name: wallet.name,
      date: wallet.date,
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});


//API: Credit / Debit amount
// router.post('/transact/:walletId', async (req, res) => {
//   try {
//     const walletId = req.params.walletId;
//     const { amount, description } = req.body;

//     const wallet = await Wallet.findById(walletId);
//     if (!wallet) {
//       return res.status(404).json({ error: 'Wallet not found' });
//     }

//     const newBalance = wallet.balance + amount;
//     if (newBalance < 0) {
//       return res.status(400).json({ error: 'Insufficient balance' });
//     }

//     const transaction = new Transaction({
//       walletId: wallet._id,
//       amount,
//       balance: newBalance,
//       description,
//       date: new Date(),
//       type: amount > 0 ? 'CREDIT' : 'DEBIT',
//     });
//     await transaction.save();

//     wallet.balance = newBalance;
//     await wallet.save();

//     res.status(200).json({ balance: newBalance, transactionId: transaction._id });
//   } catch (error) {
//     res.status(500).json({ error: 'An error occurred' });
//   }
// });



router.post('/transact/:walletId', async (req, res) => {
  try {
    const walletId = req.params.walletId;
    const { amount, description } = req.body;

  
    const parsedAmount = parseFloat(amount);

    
    if (isNaN(parsedAmount)) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

  
    const roundedAmount = parseFloat(parsedAmount.toFixed(4));

    const wallet = await Wallet.findById(walletId);
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    const newBalance = wallet.balance + roundedAmount;
    if (newBalance < 0) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const transaction = new Transaction({
      walletId: wallet._id,
      amount: roundedAmount,
      balance: newBalance,
      description,
      date: new Date(),
      type: roundedAmount > 0 ? 'CREDIT' : 'DEBIT',
    });
    await transaction.save();

    wallet.balance = newBalance;
    await wallet.save();

    res.status(200).json({ balance: newBalance, transactionId: transaction._id });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});







// API: Fetch transactions
router.get('/transactions', async (req, res) => {
  try {
    const { walletId, skip, limit } = req.query;

    const transactions = await Transaction.find({ walletId })
      .sort({ date: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

// API: Get wallet details
router.get('/wallet/:id', async (req, res) => {
  try {
    const walletId = req.params.id;
    const wallet = await Wallet.findById(walletId);

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    res.status(200).json({
      id: wallet._id,
      balance: wallet.balance,
      name: wallet.name,
      date: wallet.date,
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = router;
//64d25610e98d9fb8b13ca7de