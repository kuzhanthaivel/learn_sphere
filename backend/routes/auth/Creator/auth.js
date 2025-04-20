const jwt = require('jsonwebtoken');
const Creator = require('../../../models/Creator');
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
        const creator = await Creator.findById(decoded.id)
            .select('username email coins profile.image');
        
        if (!creator) {
            return res.status(404).json({ error: 'Creator not found' });
        }

        let imageUrl = null;
        if (creator.profile?.image) {
            if (creator.profile.image.startsWith('http')) {
                imageUrl = creator.profile.image;
            } else {
                const filename = creator.profile.image.includes('/') 
                    ? path.basename(creator.profile.image)
                    : creator.profile.image;
                imageUrl = `/uploads/profile-images/${filename}`;
            }
        } 
        
        res.json({
            creator: {
                name: creator.professionalName,
                username: creator.professionalName,
                email: creator.email,
                profile: {
                    image: imageUrl
                }
            }
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