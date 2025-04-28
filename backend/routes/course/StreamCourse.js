const jwt = require('jsonwebtoken');
const Student = require('../../models/Student');
const Course = require('../../models/Course');
const express = require('express');
const router = express.Router();

router.get('/:courseId', async (req, res) => {
    try {
        console.log('Starting course streaming request');
        const token = req.header('Authorization')?.replace('Bearer ', '');
        const courseId = req.params.courseId;
        
        console.log('Received token:', token ? 'present' : 'missing');
        console.log('Course ID:', courseId);
        
        if (!token) {
            console.log('No token provided - returning 401');
            return res.status(401).json({ error: 'Authorization token required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        
        const student = await Student.findById(decoded.id);
        console.log('Found student:', student ? student._id : 'not found');
        
        if (!student) {
            console.log('Student not found - returning 404');
            return res.status(404).json({ error: 'Student not found' });
        }

        const course = await Course.findById(courseId);
        console.log('Found course:', course ? course._id : 'not found');
        
        if (!course) {
            console.log('Course not found - returning 404');
            return res.status(404).json({ error: 'Course not found' });
        }

        const isOwned = student.ownedCourses.some(id => id.toString() === courseId);
        console.log('Is course owned:', isOwned);
        
        const rentedCourse = student.rentedCourses.find(rental => 
            rental.course.toString() === courseId && 
            new Date(rental.expiryDate) > new Date()
        );
        
        console.log('Rented course details:', rentedCourse);
        console.log('Current date:', new Date());

        if (!isOwned && !rentedCourse) {
            console.log('No access to course - returning 403');
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

        console.log('Returning successful response');
        res.json(response);
        
    } catch (error) {
        console.error('Error in course streaming route:', error);
        
        if (error.name === 'JsonWebTokenError') {
            console.log('JWT error - invalid token');
            return res.status(401).json({ error: 'Invalid token' });
        }
        
        if (error.name === 'TokenExpiredError') {
            console.log('JWT error - token expired');
            return res.status(401).json({ error: 'Token expired' });
        }

        if (error.kind === 'ObjectId') {
            console.log('Invalid ObjectId format');
            return res.status(400).json({ error: 'Invalid course ID' });
        }
        
        console.log('Internal server error');
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;