const express = require('express');
const router = express.Router();
const Student = require('../../models/Student');
const Course = require('../../models/Course');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid'); 


router.put('/', async (req, res) => {
  try {
    const { courseId, S_no, title } = req.body;

    if (!courseId || !S_no || !title) {
      return res.status(400).json({ error: 'Missing required fields: courseId, S_no, or title' });
    }

    const token = req.header('Authorization')?.replace('Bearer ', '');
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

    const hasAccess = student.ownedCourses.some(id => id.equals(courseId)) || 
                      student.rentedCourses.some(rental => rental.course.equals(courseId) && 
                      rental.expiryDate > new Date());
    
    if (!hasAccess) {
      return res.status(403).json({ error: 'Student does not have access to this course' });
    }

    const existingProgressIndex = student.courseProgress.findIndex(
      progress => progress.course.equals(courseId)
    );

    let isNewCompletion = false;
    let isFirstCourseCompletion = false;

    if (existingProgressIndex !== -1) {

      const progress = student.courseProgress[existingProgressIndex];
      const syllabusItemIndex = progress.syllabus.findIndex(item => item.S_no === S_no);

      if (syllabusItemIndex !== -1) {

        if (progress.syllabus[syllabusItemIndex].Status === 'Pending') {

          student.coins += 1;
          student.leaderboardPoints += 2;

          progress.syllabus[syllabusItemIndex].Status = 'Completed';
        }
      } else {

        progress.syllabus.push({
          S_no,
          title,
          Status: 'Completed'
        });
        
        student.coins += 1;
        student.leaderboardPoints += 2;
        progress.syllabus.sort((a, b) => a.S_no - b.S_no);
      }
      const allCompleted = progress.syllabus.every(item => item.Status === 'Completed');
      const alreadyCompleted = student.completedCourses.some(c => c.course.equals(courseId));

      if (allCompleted && !alreadyCompleted) {
        isNewCompletion = true;

        isFirstCourseCompletion = student.completedCourses.length === 0;
        student.completedCourses.push({
          course: courseId,
          completedAt: new Date(),
          certificateID: uuidv4()
        });

        if (isFirstCourseCompletion) {
          student.badges.level4 = true;
        }
      }
    } else {
      const newProgress = {
        course: courseId,
        syllabus: course.syllabus.map(item => ({
          S_no: item.S_no,
          title: item.title,
          Status: item.S_no <= S_no ? 'Completed' : 'Pending'
        }))
      };

      const completedCount = course.syllabus.filter(item => item.S_no <= S_no).length;
      student.coins += completedCount;
      student.leaderboardPoints += completedCount * 2;

      student.courseProgress.push(newProgress);

      if (course.syllabus.every(item => item.S_no <= S_no)) {
        isNewCompletion = true;
        isFirstCourseCompletion = student.completedCourses.length === 0;
        
        student.completedCourses.push({
          course: courseId,
          completedAt: new Date(),
          certificateID: uuidv4()
        });

        if (isFirstCourseCompletion) {
          student.badges.level4 = true;
        }
      }
    }

    await student.save();

    const updatedProgress = student.courseProgress.find(
      progress => progress.course.equals(courseId)
    );

    const response = {
      success: true,
      message: 'Progress updated successfully',
      coinsAwarded: 1,
      pointsAwarded: 2,
      courseProgress: updatedProgress
    };

    if (isNewCompletion) {
      response.courseCompleted = true;
      response.certificateID = student.completedCourses.find(
        c => c.course.equals(courseId)
      ).certificateID;
      
      if (isFirstCourseCompletion) {
        response.badgeUnlocked = 'level4';
      }
    }

    res.status(200).json(response);

  } catch (error) {
    console.error('Error updating progress:', error);
    
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