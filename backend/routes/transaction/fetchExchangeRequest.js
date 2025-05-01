const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Student = require('../../models/Student');
const ExchangeRequest = require('../../models/ExchangeRequest');
const ExchangeCode = require('../../models/ExchangeCode');

router.get('/', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const { code } = req.query;

    if (!token) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    if (!code) {
      return res.status(400).json({ error: 'Exchange code is required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const student = await Student.findById(decoded.id);
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const exchangeCode = await ExchangeCode.findOne({ code });
    if (!exchangeCode) {
      return res.status(404).json({ error: 'Exchange code not found' });
    }

    const requests = await ExchangeRequest.find({
      status: 'notResponded',
      $or: [
        { initiator: student._id, initiatorCode: code },
        { receiver: student._id, receiverCode: code }
      ]
    }).populate('initiator receiver', 'username email');

    const formattedRequests = requests.map(request => {
      const isInitiator = request.initiator._id.equals(student._id);
      return {
        _id: request._id,
        initiator: request.initiator,
        receiver: request.receiver,
        initiatorCode: request.initiatorCode,
        receiverCode: request.receiverCode,
        status: request.status,
        createdAt: request.createdAt,
        isInitiator,
      };
    });

    res.json(formattedRequests);
  } catch (error) {
    console.error('Error fetching exchange requests:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;