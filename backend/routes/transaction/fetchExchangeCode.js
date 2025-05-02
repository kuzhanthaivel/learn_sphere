const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const ExchangeCode = require('../../models/ExchangeCode');
const Student = require('../../models/Student');

router.get('/:courseId', async (req, res) => {
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

        const courseId = req.params.courseId;

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ error: 'Invalid course ID' });
        }

        const exchangeCode = await ExchangeCode.findOne({
            user: student._id,
            course: courseId
        });

        if (!exchangeCode) {
            return res.status(404).json({
                success: false,
                error: 'Exchange code not found for this course'
            });
        }

        res.json({
            success: true,
            code: exchangeCode.code
        });

    } catch (error) {
        console.error('Error fetching exchange code:', error);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                error: 'Invalid token'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: 'Token expired'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Server error while fetching exchange code'
        });
    }
});

module.exports = router;