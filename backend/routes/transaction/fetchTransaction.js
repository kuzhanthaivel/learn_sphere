const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Transaction = require('../../models/Transaction');
const Student = require('../../models/Student');
const Course = require('../../models/Course');

router.get('/', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const student = await Student.findById(decoded.id).select('username');

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const transactions = await Transaction.find({ user: student._id })
      .populate({
        path: 'course',
        select: 'title category'
      })
      .populate({
        path: 'exchangeData',
        select: '_id'
      })
      .sort({ createdAt: -1 });

    const formattedTransactions = transactions.map(transaction => ({
      transactionId: transaction._id,
      UserName: student.username,
      timestamp: transaction.createdAt,
      courseName: transaction.course?.title || 'N/A',
      courseCategory: transaction.course?.category || 'N/A',
      transactionType: transaction.transactionType,
      paymentMethod: transaction.paymentMethod,
      amount: formatAmount(transaction),
      exchangeId: transaction.exchangeData?._id.toString() || 'N/A'
    }));

    res.json(formattedTransactions);
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Server error while fetching transactions' });
  }
});

function formatAmount(transaction) {
  if (transaction.paymentMethod === 'Money') {
    return `₹${transaction.amount}`;
  } else if (transaction.paymentMethod === 'Coins') {
    return `${transaction.coinsVolume} Coins`;
  } else if (transaction.transactionType === 'Exchange') {
    return 'Free';
  }
  return 'N/A';
}

module.exports = router;