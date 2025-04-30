const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Course = require('../../models/Course');
const Student = require('../../models/Student');
const Community = require('../../models/Community');
const Transaction = require('../../models/Transaction');

router.post('/', async (req, res) => {
    try {
        // Verify token and get student
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'Authorization token required' });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const student = await Student.findById(decoded.id);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Get input from request body
        const { 
            courseId, 
            transactionType, 
            paymentMethod, 
            amount, 
            coinsVolume, 
            rentalDuration 
        } = req.body;

        // Validate required fields
        if (!courseId || !transactionType || !paymentMethod || !rentalDuration) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if payment method matches provided amount
        if (paymentMethod === 'Money' && !amount) {
            return res.status(400).json({ error: 'Amount is required for money payment' });
        }
        if (paymentMethod === 'Coins' && !coinsVolume) {
            return res.status(400).json({ error: 'Coins volume is required for coins payment' });
        }

        // Find the course
        const course = await Course.findById(courseId).populate('community');
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Check if student already owns or has rented the course
        const alreadyOwned = student.ownedCourses.includes(courseId);
        const alreadyRented = student.rentedCourses.some(rental => 
            rental.course.equals(courseId) && rental.expiryDate > new Date()
        );
        
        if (alreadyOwned || alreadyRented) {
            return res.status(400).json({ error: 'You already have access to this course' });
        }

        // Calculate expiry date
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + parseInt(rentalDuration));

        // Process payment and update coins/leaderboard points
        if (paymentMethod === 'Money') {
            // Add half of the amount as coins
            const coinsToAdd = Math.floor(amount / 2);
            student.coins += coinsToAdd;
            
            // Add half of the amount to leaderboard points
            student.leaderboardPoints += coinsToAdd;
        } else if (paymentMethod === 'Coins') {
            // Check coins balance
            if (student.coins < coinsVolume) {
                return res.status(400).json({ error: 'Insufficient coins balance' });
            }
            
            // Deduct coins
            student.coins -= coinsVolume;
            
            // Add 1/4 of the coins to leaderboard points
            const pointsToAdd = Math.floor(coinsVolume / 4);
            student.leaderboardPoints += pointsToAdd;
        }

        // Add to rented courses
        const rentalData = {
            course: courseId,
            paymentMethod: paymentMethod.toLowerCase(),
            amountPaid: paymentMethod === 'Money' ? amount : coinsVolume,
            durationDays: rentalDuration,
            expiryDate: expiryDate
        };

        student.rentedCourses.push(rentalData);

        // Check if this is the first rental and set level2 badge
        if (student.rentedCourses.length === 1) {
            student.badges.level2 = true;
        }

        // Add course to student's communities if not already there
        if (!student.communities.includes(course.community._id)) {
            student.communities.push(course.community._id);
        }

        // Add student to course's students if not already there
        if (!course.students.includes(student._id)) {
            course.students.push(student._id);
        }

        // Create transaction record
        const transaction = new Transaction({
            user: student._id,
            course: courseId,
            transactionType: transactionType,
            paymentMethod: paymentMethod,
            amount: paymentMethod === 'Money' ? amount : undefined,
            coinsVolume: paymentMethod === 'Coins' ? coinsVolume : undefined,
            rentalDuration: rentalDuration,
            status: 'Completed'
        });

        // Add student to community members if not already there
        const community = await Community.findById(course.community._id);
        const isMember = community.members.some(member => 
            member.user.equals(student._id) && member.userType === 'Student'
        );

        if (!isMember) {
            community.members.push({
                user: student._id,
                userType: 'Student',
                role: 'Student'
            });
        }

        // Save all changes
        await Promise.all([
            student.save(),
            course.save(),
            community.save(),
            transaction.save()
        ]);

        res.status(201).json({
            message: 'Course rented successfully',
            rental: rentalData,
            transaction: transaction,
            coinsAdded: paymentMethod === 'Money' ? Math.floor(amount / 2) : 0,
            leaderboardPointsAdded: paymentMethod === 'Money' 
                ? Math.floor(amount / 2) 
                : Math.floor(coinsVolume / 4)
        });

    } catch (error) {
        console.error('Error renting course:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }

    
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;