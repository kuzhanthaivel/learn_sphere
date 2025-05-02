const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Student = require('../../models/Student');
const Creator = require('../../models/Creator');
const Community = require('../../models/Community');

router.get('/', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'Authorization token required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        let user = await Student.findById(decoded.id).select('communities');
        let userType = 'Student';

        if (!user) {
            user = await Creator.findById(decoded.id).select('communities');
            userType = 'Creator';

            if (!user) {
                return res.status(404).json({ error: 'User not found in either Student or Creator models' });
            }
        }

        const communities = await Community.find({
            _id: { $in: user.communities }
        })
            .select('name members')
            .lean();

        const formattedCommunities = communities.map(community => ({
            _id: community._id,
            name: community.name,
            memberCount: community.members.length
        }));

        res.status(200).json({
            success: true,
            communities: formattedCommunities,
            userType: userType
        });
    } catch (error) {
        console.error('Error fetching communities:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;