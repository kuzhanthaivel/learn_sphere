const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Student = require('../../models/Student');
const Course = require('../../models/Course');
const ExchangeCode = require('../../models/ExchangeCode');
const ExchangeRequest = require('../../models/ExchangeRequest');
const Transaction = require('../../models/Transaction');

function generatePermanentCode(studentId, courseId) {
  const combined = `${studentId}${courseId}`;
  const hash = crypto.createHash('sha1').update(combined).digest('hex');
  return hash.slice(0, 10).toUpperCase();
}

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

    const { requestId, userType, status } = req.body;

    if (!requestId || !userType || !status) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    if (!['initiator', 'receiver'].includes(userType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid userType'
      });
    }

    if (!['Canceled', 'Accepted'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }

    const exchangeRequest = await ExchangeRequest.findById(requestId);
    if (!exchangeRequest) {
      return res.status(404).json({
        success: false,
        error: 'Exchange request not found'
      });
    }

    if (userType === 'initiator' && !exchangeRequest.initiator.equals(student._id)) {
      return res.status(403).json({
        success: false,
        error: 'You are not the initiator of this request'
      });
    }

    if (userType === 'receiver' && !exchangeRequest.receiver.equals(student._id)) {
      return res.status(403).json({
        success: false,
        error: 'You are not the receiver of this request'
      });
    }

    if (status === 'Canceled') {
      exchangeRequest.status = 'Canceled';
      await exchangeRequest.save();
      return res.status(200).json({
        success: true,
        message: 'Exchange request canceled'
      });
    }

    if (status === 'Accepted') {
      if (!exchangeRequest.initiatorCode || !exchangeRequest.receiverCode) {
        return res.status(400).json({
          success: false,
          error: 'Exchange codes missing'
        });
      }

      const initiatorCode = await ExchangeCode.findOne({ code: exchangeRequest.initiatorCode });
      const receiverCode = await ExchangeCode.findOne({ code: exchangeRequest.receiverCode });

      if (!initiatorCode || !receiverCode) {
        return res.status(404).json({
          success: false,
          error: 'Invalid exchange codes'
        });
      }

      const initiatorStudent = await Student.findById(initiatorCode.user);
      const receiverStudent = await Student.findById(receiverCode.user);
      const initiatorCourse = await Course.findById(initiatorCode.course);
      const receiverCourse = await Course.findById(receiverCode.course);

      if (!initiatorStudent || !receiverStudent || !initiatorCourse || !receiverCourse) {
        return res.status(404).json({
          success: false,
          error: 'Invalid student or course in exchange'
        });
      }

      if (!initiatorStudent.ownedCourses.includes(initiatorCourse._id)) {
        return res.status(400).json({
          success: false,
          error: 'Initiator no longer owns the course'
        });
      }

      if (!receiverStudent.ownedCourses.includes(receiverCourse._id)) {
        return res.status(400).json({
          success: false,
          error: 'Receiver no longer owns the course'
        });
      }

      initiatorStudent.ownedCourses = initiatorStudent.ownedCourses.filter(
        courseId => !courseId.equals(initiatorCourse._id)
      );
      receiverStudent.ownedCourses = receiverStudent.ownedCourses.filter(
        courseId => !courseId.equals(receiverCourse._id)
      );

      initiatorStudent.ownedCourses.push(receiverCourse._id);
      receiverStudent.ownedCourses.push(initiatorCourse._id);

      initiatorStudent.communities = initiatorStudent.communities.filter(
        communityId => !communityId.equals(initiatorCourse.community)
      );
      receiverStudent.communities = receiverStudent.communities.filter(
        communityId => !communityId.equals(receiverCourse.community)
      );

      initiatorStudent.communities.push(receiverCourse.community);
      receiverStudent.communities.push(initiatorCourse.community);

      await Promise.all([
        initiatorStudent.save(),
        receiverStudent.save()
      ]);

      initiatorCourse.students = initiatorCourse.students.filter(
        studentId => !studentId.equals(initiatorStudent._id)
      );
      receiverCourse.students = receiverCourse.students.filter(
        studentId => !studentId.equals(receiverStudent._id)
      );

      initiatorCourse.students.push(receiverStudent._id);
      receiverCourse.students.push(initiatorStudent._id);

      await Promise.all([
        initiatorCourse.save(),
        receiverCourse.save()
      ]);

      await ExchangeCode.deleteMany({
        _id: { $in: [initiatorCode._id, receiverCode._id] }
      });

      const [newInitiatorCode, newReceiverCode] = await Promise.all([
        new ExchangeCode({
          user: initiatorStudent._id,
          course: receiverCourse._id,
          code: generatePermanentCode(initiatorStudent._id, receiverCourse._id)
        }).save(),
        new ExchangeCode({
          user: receiverStudent._id,
          course: initiatorCourse._id,
          code: generatePermanentCode(receiverStudent._id, initiatorCourse._id)
        }).save()
      ]);

      const transaction = await new Transaction({
        user: exchangeRequest.receiver,
        course: receiverCourse._id,
        transactionType: 'Exchange',
        paymentMethod: 'Exchange',
        exchangeData: exchangeRequest._id,
        status: 'Completed'
      }).save();

      exchangeRequest.status = 'Accepted';
      exchangeRequest.completedAt = new Date();
      await exchangeRequest.save();

      const responseData = {
        transactionId: transaction._id,
        timestamp: transaction.createdAt,
        courseName: receiverCourse.title,
        courseCategory: receiverCourse.category || 'Uncategorized',
        transactionType: 'Exchange',
        paymentMethod: 'Free',
        amount: 'Free',
        exchangeId: exchangeRequest._id
      };

      return res.status(200).json({
        success: true,
        data: responseData,
        message: 'Course exchange completed successfully'
      });
    }
  } catch (error) {
    console.error('Exchange error:', error);
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