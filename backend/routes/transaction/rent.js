const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Course = require('../../models/Course');
const Student = require('../../models/Student');
const Community = require('../../models/Community');
const Transaction = require('../../models/Transaction');

router.post('/', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Authorization token required'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const student = await Student.findById(decoded.id);
        if (!student) {
            return res.status(404).json({
                success: false,
                error: 'Student not found'
            });
        }

        const {
            courseId,
            transactionType,
            paymentMethod,
            amount,
            coinsVolume,
            rentalDuration
        } = req.body;

        if (!courseId || !transactionType || !paymentMethod || !rentalDuration) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields',
                details: {
                    missingCourseId: !courseId,
                    missingTransactionType: !transactionType,
                    missingPaymentMethod: !paymentMethod,
                    missingRentalDuration: !rentalDuration
                }
            });
        }

        if (paymentMethod === 'Money' && !amount) {
            return res.status(400).json({
                success: false,
                error: 'Amount is required for money payment'
            });
        }
        if (paymentMethod === 'Coins' && !coinsVolume) {
            return res.status(400).json({
                success: false,
                error: 'Coins volume is required for coins payment'
            });
        }

        const course = await Course.findById(courseId).populate('community');
        if (!course) {
            return res.status(404).json({
                success: false,
                error: 'Course not found'
            });
        }

        const alreadyOwned = student.ownedCourses.includes(courseId);
        const alreadyRented = student.rentedCourses.some(rental =>
            rental.course.equals(courseId) && rental.expiryDate > new Date()
        );

        if (alreadyOwned || alreadyRented) {
            return res.status(400).json({
                success: false,
                error: 'You already have access to this course'
            });
        }

        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + parseInt(rentalDuration));

        let coinsAdded = 0;
        let pointsAdded = 0;

        if (paymentMethod === 'Money') {

            coinsAdded = Math.floor(amount / 2);
            student.coins += coinsAdded;
            pointsAdded = coinsAdded;
            student.leaderboardPoints += pointsAdded;
        } else if (paymentMethod === 'Coins') {
            if (student.coins < coinsVolume) {
                return res.status(400).json({
                    success: false,
                    error: 'Insufficient coins balance'
                });
            }

            student.coins -= coinsVolume;

            pointsAdded = Math.floor(coinsVolume / 4);
            student.leaderboardPoints += pointsAdded;
        }

        const rentalData = {
            course: courseId,
            paymentMethod: paymentMethod.toLowerCase(),
            amountPaid: paymentMethod === 'Money' ? amount : coinsVolume,
            durationDays: rentalDuration,
            expiryDate: expiryDate
        };

        student.rentedCourses.push(rentalData);

        const isFirstRental = student.rentedCourses.length === 1;
        if (isFirstRental) {
            student.badges.level2 = true;
        }

        if (!student.communities.includes(course.community._id)) {
            student.communities.push(course.community._id);
        }

        if (!course.students.includes(student._id)) {
            course.students.push(student._id);
        }

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

        const community = await Community.findById(course.community._id);
        const isMember = community.members.some(member =>
            member.user.equals(student._id) && member.userType === 'Student'
        );

        if (!isMember) {
            community.members.push({
                user: student._id,
                userType: 'Student',
                role: 'Student',
                joinedAt: new Date()
            });
        }

        await Promise.all([
            student.save(),
            course.save(),
            community.save(),
            transaction.save()
        ]);

        const responseData = {
            transactionId: transaction._id,
            timestamp: transaction.createdAt,
            courseName: course.title,
            courseCategory: course.category || 'Uncategorized',
            transactionType: transactionType,
            paymentMethod: paymentMethod,
            amount: paymentMethod === 'Money' ? `₹${amount}` :
                paymentMethod === 'Coins' ? `${coinsVolume} Coins` : 'Free',
            exchangeId: 'N/A',
            rentalDuration: `${rentalDuration} days`,
            expiryDate: expiryDate.toISOString()
        };

        res.status(201).json({
            success: true,
            data: responseData,
            coinsAdded: coinsAdded,
            pointsAdded: pointsAdded,
            badgeUpdated: isFirstRental ? 'level2' : null,
            message: 'Course rented successfully'
        });

    } catch (error) {
        console.error('Error renting course:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                error: 'Invalid token'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Internal server error',
            details: error.message
        });
    }
});

module.exports = router;