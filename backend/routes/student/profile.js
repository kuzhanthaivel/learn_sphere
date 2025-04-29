const jwt = require('jsonwebtoken');
const Student = require('../../models/Student');
const Student = require('../../models/Course');
const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'Authorization token required' });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const student = await Student.findById(decoded.id)
            .select('username email coins profile.image');
        
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json({

        });
        
    } catch (error) {
        console.error('Error in /me route:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;