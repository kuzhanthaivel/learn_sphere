const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Student = require('../../models/Student');
const ExchangeRequest = require('../../models/ExchangeRequest');
const ExchangeCode = require('../../models/ExchangeCode');

router.post('/', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const student = await Student.findById(decoded.id);
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const { initiatorCode, receiverCode } = req.body;

    if (!initiatorCode || !receiverCode) {
      return res.status(400).json({ error: 'Both initiatorCode and receiverCode are required' });
    }
    const initiatorExchangeCode = await ExchangeCode.findOne({ 
      code: initiatorCode,
      user: student._id 
    });

    if (!initiatorExchangeCode) {
      return res.status(403).json({ 
        error: 'The initiator code does not belong to you or is invalid' 
      });
    }

    const receiverExchangeCode = await ExchangeCode.findOne({ 
      code: receiverCode 
    }).populate('user');

    if (!receiverExchangeCode) {
      return res.status(404).json({ error: 'The receiver code was not found' });
    }

    const receiverStudent = receiverExchangeCode.user;

    if (receiverStudent._id.toString() === student._id.toString()) {
      return res.status(400).json({ error: 'You cannot create an exchange request with yourself' });
    }

    const existingRequest = await ExchangeRequest.findOne({
      initiator: student._id,
      receiver: receiverStudent._id,
      initiatorCode,
      receiverCode,
      status: 'notResponded'
    });

    if (existingRequest) {
      return res.status(409).json({ 
        error: 'You already have a pending exchange request with these codes' 
      });
    }

    const exchangeRequest = new ExchangeRequest({
      initiator: student._id,
      receiver: receiverStudent._id,
      initiatorCode,
      receiverCode,
      status: 'notResponded'
    });

    await exchangeRequest.save();

    res.status(201).json({
      success: true,
      message: 'Exchange request created successfully',
      data: exchangeRequest,
    });

  } catch (error) {
    console.error('Error creating exchange request:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, error: 'Token expired' });
    }
    
    res.status(500).json({ 
      success: false, 
      error: 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;