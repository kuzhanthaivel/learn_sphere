const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Student = require('../../models/Student');
const Creator = require('../../models/Creator');
const Community = require('../../models/Community');

router.post('/', async (req, res) => {
    try {

        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ error: 'Authorization token required' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { communityId } = req.body;
        if (!communityId) return res.status(400).json({ error: 'communityId required' });

        const user = await Student.findById(decoded.id).select('communities') ||
            await Creator.findById(decoded.id).select('communities');
        if (!user) return res.status(404).json({ error: 'User not found' });
        if (!user.communities.some(c => c.equals(communityId))) {
            return res.status(403).json({ error: 'Not a community member' });
        }
        const community = await Community.findById(communityId)
            .select('messages')
            .lean();

        const formattedMessages = community.messages.map(message => ({
            _id: message._id,
            "user id": message.user,
            userType: message.userType,
            userName: message.userName,
            content: message.content,
            createdAt: message.createdAt,
            isYou: message.user.equals(decoded.id)
        }));

        res.status(200).json({
            success: true,
            messages: formattedMessages
        });

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
module.exports = router;