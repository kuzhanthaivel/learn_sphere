const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Creator = require('../../../models/Creator');

const JWT_SECRET = process.env.JWT_SECRET || 'CheckCheckHello123Mic123helllohello';

router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }
        const creator = await Creator.findOne({ email });
        if (!creator) {
            return res.status(404).json({ message: 'Creator not found. Please sign up first.' });
        }

        const isPasswordValid = await bcrypt.compare(password, creator.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
        const token = jwt.sign(
            { id: creator._id, email: creator.email },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        creator.token = token;
        await creator.save();

        res.status(200).json({
            message: 'Signin successful',
            token,
            creator: {
                id: creator._id,
                professionalName: creator.professionalName,
                email: creator.email,
                walletAddress: creator.walletAddress,
                bio: creator.profile.bio,
                image: creator.profile.image,
                socialLinks: creator.profile.socialLinks,
                createdCourses: creator.createdCourses,
                createdAt: creator.createdAt
            }
        });
    } catch (error) {
        console.error('Error during creator signin:', error);
        res.status(500).json({ message: 'An error occurred during signin. Please try again later.' });
    }
});

module.exports = router;
