const jwt = require('jsonwebtoken');
const Student = require('../../models/Student');
const Course = require('../../models/Course');
const Community = require('../../models/Community');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'Authorization token required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        await checkAndUpdateExpiredRentals(decoded.id);

        const student = await Student.findById(decoded.id)
            .select('ownedCourses rentedCourses')
            .populate({
                path: 'ownedCourses',
                select: '_id title shortDescription category community coverImage'
            })
            .populate({
                path: 'rentedCourses.course',
                select: '_id title shortDescription category community coverImage'
            });

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const ownedCourses = student.ownedCourses.map(course => ({
            id: course._id,
            title: course.title,
            shortDescription: course.shortDescription,
            category: course.category,
            community: course.community,
            coverImage: course.coverImage,
            accessType: 'owned'
        }));

        const rentedCourses = student.rentedCourses
            .filter(rental => rental.status === 'Available')
            .map(rental => ({
                id: rental.course._id,
                title: rental.course.title,
                shortDescription: rental.course.shortDescription,
                category: rental.course.category,
                community: rental.course.community,
                coverImage: rental.course.coverImage,
                accessType: 'rented',
                expiryDate: rental.expiryDate,
                daysRemaining: Math.ceil((rental.expiryDate - Date.now()) / (1000 * 60 * 60 * 24))
            }));

        const response = [...ownedCourses, ...rentedCourses];

        res.json({
            success: true,
            data: response
        });

    } catch (error) {
        console.error('Error fetching courses:', error);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }

        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
});

async function checkAndUpdateExpiredRentals(studentId) {
    const now = new Date();

    const student = await Student.findOne({
        _id: studentId,
        'rentedCourses': {
            $elemMatch: {
                status: 'Available',
                expiryDate: { $lte: now }
            }
        }
    }).select('rentedCourses communities');

    if (!student) return;

    const expiredRentals = student.rentedCourses.filter(
        rental => rental.status === 'Available' && rental.expiryDate <= now
    );

    if (expiredRentals.length === 0) return;

    const updatePromises = expiredRentals.map(async (rental) => {

        await Student.updateOne(
            { _id: studentId, 'rentedCourses._id': rental._id },
            { $set: { 'rentedCourses.$.status': 'Expired' } }
        );

        const isOwned = student.ownedCourses.includes(rental.course);
        if (!isOwned) {
            await Course.updateOne(
                { _id: rental.course },
                { $pull: { students: studentId } }
            );
        }

        const course = await Course.findById(rental.course).select('community');
        if (course?.community) {

            await Community.updateOne(
                { _id: course.community },
                { $pull: { members: { user: studentId } } }
            );

            const otherCoursesInCommunity = await Course.countDocuments({
                community: course.community,
                students: studentId
            });

            if (otherCoursesInCommunity === 0) {
                await Student.updateOne(
                    { _id: studentId },
                    { $pull: { communities: course.community } }
                );
            }
        }
    });

    await Promise.all(updatePromises);
}

module.exports = router;