const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Course = require('../../models/Course');
const Student = require('../../models/Student');
const Community = require('../../models/Community');
const Transaction = require('../../models/Transaction');
const ExchangeCode = require('../../models/ExchangeCode');
const crypto = require('crypto');

function generatePermanentCode(studentId, courseId) {
  const combined = `${studentId}${courseId}`;
  const hash = crypto.createHash('sha1').update(combined).digest('hex');
  return hash.slice(0, 10).toUpperCase(); 
}


router.post('/', async (req, res) => {
  
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { courseId, amount } = req.body;

    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log(token);
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'CheckCheckHello123Mic123helllohello');
    const studentId = decoded.id;

    if (!courseId || !amount || isNaN(amount)) {
      console.log('Validation failed: Invalid input');
      await session.abortTransaction();
      return res.status(400).json({ 
        error: 'Invalid input',
        details: !courseId ? 'Missing courseId' : 
                !amount ? 'Missing amount' : 'Amount must be a number'
      });
    }

    const course = await Course.findById(courseId).session(session);
    if (!course) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Course not found' });
    }

    const student = await Student.findById(studentId).session(session);
    if (!student) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Student not found' });
    }

    if (student.ownedCourses.some(c => c.equals(courseId))) {
      await session.abortTransaction();
      return res.status(409).json({ error: 'You already own this course' });
    }

    course.students.addToSet(studentId);
    await course.save({ session });

    const community = await Community.findById(course.community).session(session);
    if (!community.members.some(m => m.user.equals(studentId))) {
      community.members.push({
        user: studentId,
        userType: 'Student',
        role: 'Student',
        joinedAt: new Date()
      });
      await community.save({ session });
    }

    student.ownedCourses.addToSet(courseId);
    student.communities.addToSet(course.community);

    const isFirstCourse = student.ownedCourses.length === 0;
    if (isFirstCourse) {
      student.badges.level2 = true;
    }

    const pointsAndCoins = Math.floor(amount * 0.5);
    student.leaderboardPoints += pointsAndCoins;
    student.coins += pointsAndCoins;

    const exchangeCode = new ExchangeCode({
      user: studentId,
      course: courseId,
      code: generatePermanentCode(studentId, courseId),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) 
    });

    const transaction = new Transaction({
      user: studentId,
      course: courseId,
      transactionType: 'Buy',
      paymentMethod: 'Money',
      amount: amount,
      status: 'Completed',
    });

    await Promise.all([
      student.save({ session }),
      exchangeCode.save({ session }),
      transaction.save({ session })
    ]);

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      data: {
        transactionId: transaction._id,
        course: course.title,
        exchangeCode: exchangeCode.code,
        coinsAdded: pointsAndCoins,
        pointsAdded: pointsAndCoins,
        badgesUpdated: isFirstCourse ? ['level2'] : []
      }
    });

  } catch (error) {
    await session.abortTransaction();;
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    res.status(500).json({
      error: 'Purchase processing failed',
      details: error.message
    });
  } finally {
    session.endSession();
  }
});

module.exports = router;