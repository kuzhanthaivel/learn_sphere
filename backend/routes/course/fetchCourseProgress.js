const express = require('express');
const router = express.Router();
const Student = require('../../models/Student');
const jwt = require('jsonwebtoken');

router.put('/', async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required field: courseId' 
      });
    }

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

    const courseProgress = student.courseProgress.find(progress => 
      progress.course.toString() === courseId
    );

    if (!courseProgress) {
      return res.status(404).json({ 
        success: false,
        error: 'Course progress not found for this student' 
      });
    }

    const response = {
      success: true,
      message: 'Course progress retrieved successfully',
      courseProgress: {
        course: courseProgress.course,
        syllabus: courseProgress.syllabus
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching course progress:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid token' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        error: 'Token expired' 
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