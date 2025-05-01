const jwt = require('jsonwebtoken');
const Student = require('../../models/Student');
const Course = require('../../models/Course');
const express = require('express');
const router = express.Router();

router.get('/:courseId', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        const courseId = req.params.courseId;
        
        
        if (!token) {
            return res.status(401).json({ error: 'Authorization token required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const student = await Student.findById(decoded.id);
        
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const course = await Course.findById(courseId);
        
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        const isOwned = student.ownedCourses.some(id => id.toString() === courseId);
        
        const rentedCourse = student.rentedCourses.find(rental => 
            rental.course.toString() === courseId && 
            new Date(rental.expiryDate) > new Date()
        );
        

        if (!isOwned && !rentedCourse) {
            return res.status(403).json({ error: 'You do not have access to this course' });
        }

        const response = {
            title: course.title,
            shortDescription: course.shortDescription,
            fullDescription: course.fullDescription,
            category: course.category,
            syllabus: course.syllabus,
            coverImage: course.coverImage,
            rentedCourse: !isOwned, 
            expiryDate: rentedCourse?.expiryDate 
        };

        res.json(response);
        
    } catch (error) {
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }

        if (error.kind === 'ObjectId') {
            return res.status(400).json({ error: 'Invalid course ID' });
        }

        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;