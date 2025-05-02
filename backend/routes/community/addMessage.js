const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Community = require('../../models/Community');
const Student = require('../../models/Student');
const Creator = require('../../models/Creator');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { communityId, content } = req.body;
        if (!communityId || !mongoose.Types.ObjectId.isValid(communityId)) {

            return res.status(400).json({ error: 'Valid community ID is required' });
        }

        if (!content || content.trim().length === 0) {
            return res.status(400).json({ error: 'Message content is required' });
        }

        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'Authorization token required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        let user = await Student.findById(decoded.id);
        let userType = 'Student';
        let username;

        if (!user) {
            user = await Creator.findById(decoded.id);
            userType = 'Creator';

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            username = user.professionalName;
        } else {
            username = user.username;
        }

        const community = await Community.findById(communityId);
        if (!community) {
            return res.status(404).json({ error: 'Community not found' });
        }

        const isMember = community.members.some(member =>
            member.user.equals(decoded.id) && member.userType === userType
        );

        if (!isMember) {
            return res.status(403).json({ error: 'You are not a member of this community' });
        }

        const newMessage = {
            user: decoded.id,
            userType,
            userName: username,
            content: content.trim(),
            createdAt: new Date()
        };

        community.messages.push(newMessage);
        await community.save();

        res.status(201).json({
            message: 'Message added successfully',
            newMessage
        });

    } catch (error) {
        console.error('Error adding message:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        res.status(500).json({ error: 'Server error while adding message' });
    }
});

module.exports = router;