const jwt = require('jsonwebtoken');
const Student = require('../../models/Student');
const Course = require('../../models/Course');
const express = require('express');
const router = express.Router();

router.get('/owned-courses', async (req, res) => {
    try {
        // Get and verify token
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'Authorization token required' });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        

        const student = await Student.findById(decoded.id)
            .select('ownedCourses')
            .populate({
                path: 'ownedCourses',
                select: '_id title shortDescription category community coverImage'
            });
        
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Format the response
        const ownedCourses = student.ownedCourses.map(course => ({
            id: course._id,
            title: course.title,
            shortDescription: course.shortDescription,
            category: course.category,
            community: course.community, // This will be the ObjectId
            coverImage: course.coverImage
        }));

        res.json({
            success: true,
            data: ownedCourses
        });
        
    } catch (error) {
        console.error('Error fetching owned courses:', error);
        
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

module.exports = router;