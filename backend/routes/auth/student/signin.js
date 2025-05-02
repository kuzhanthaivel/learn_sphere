const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Student = require('../../../models/Student');


router.post('/', async (req, res) => {
    try {
        const JWT_SECRET = process.env.JWT_SECRET ;
        
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const user = await Student.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found. Please sign up first.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1d' }
        );
        user.token = token;
        user.coins += 2;
        user.leaderboardPoints += 2;

        if (user.badges === undefined || user.badges === null) {
            user.badges = [];
        }


        await user.save();

        res.status(200).json({
            message: 'Signin successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                walletAddress: user.walletAddress,
                bio: user.bio,
                coins: user.coins,
                image: user.image,
                github: user.github,
                linkedin: user.linkedin,
                twitter: user.twitter,
                portfolio: user.portfolio
            }
        });
    } catch (error) {
        console.error('Error during signin:', error);
        res.status(500).json({ message: 'An error occurred during signin. Please try again later.' });
    }
});

module.exports = router;
