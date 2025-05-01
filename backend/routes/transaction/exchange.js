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
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const student = await Student.findById(decoded.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const { requestId, userType, status } = req.body;

    if (!requestId || !userType || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!['initiator', 'receiver'].includes(userType)) {
      return res.status(400).json({ error: 'Invalid userType' });
    }

    if (!['Canceled', 'Accepted'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const exchangeRequest = await ExchangeRequest.findById(requestId);
    if (!exchangeRequest) {
      console.log(`Exchange request not found: ${requestId}`);
      return res.status(404).json({ error: 'Exchange request not found' });
    }

    console.log(`Found exchange request: ${exchangeRequest._id} with status ${exchangeRequest.status}`);

    if (userType === 'initiator' && !exchangeRequest.initiator.equals(student._id)) {
      console.log(`Student ${student._id} is not the initiator of request ${requestId}`);
      return res.status(403).json({ error: 'You are not the initiator of this request' });
    }

    if (userType === 'receiver' && !exchangeRequest.receiver.equals(student._id)) {
      console.log(`Student ${student._id} is not the receiver of request ${requestId}`);
      return res.status(403).json({ error: 'You are not the receiver of this request' });
    }

    if (status === 'Canceled') {
      console.log(`Canceling exchange request ${requestId}`);
      exchangeRequest.status = 'Canceled';
      await exchangeRequest.save();
      console.log(`Exchange request ${requestId} canceled successfully`);
      return res.status(200).json({ message: 'Exchange request canceled' });
    }
    if (status === 'Accepted') {
      console.log('Processing accepted exchange request');

      if (!exchangeRequest.initiatorCode || !exchangeRequest.receiverCode) {
        console.log('Exchange codes missing in request');
        return res.status(400).json({ error: 'Exchange codes missing' });
      }

      console.log(`Initiator code: ${exchangeRequest.initiatorCode}, Receiver code: ${exchangeRequest.receiverCode}`);
      const initiatorCode = await ExchangeCode.findOne({ code: exchangeRequest.initiatorCode });
      const receiverCode = await ExchangeCode.findOne({ code: exchangeRequest.receiverCode });

      if (!initiatorCode || !receiverCode) {
        console.log('Invalid exchange codes:', { 
          initiatorCodeExists: !!initiatorCode, 
          receiverCodeExists: !!receiverCode 
        });
        return res.status(404).json({ error: 'Invalid exchange codes' });
      }

      console.log('Found valid exchange codes');

      const initiatorStudent = await Student.findById(initiatorCode.user);
      const receiverStudent = await Student.findById(receiverCode.user);
      const initiatorCourse = await Course.findById(initiatorCode.course);
      const receiverCourse = await Course.findById(receiverCode.course);

      if (!initiatorStudent || !receiverStudent || !initiatorCourse || !receiverCourse) {
        console.log('Missing entities:', {
          initiatorStudent: !!initiatorStudent,
          receiverStudent: !!receiverStudent,
          initiatorCourse: !!initiatorCourse,
          receiverCourse: !!receiverCourse
        });
        return res.status(404).json({ error: 'Invalid student or course in exchange' });
      }

      console.log('Found all students and courses for exchange');

      // Verify students own their respective courses
      if (!initiatorStudent.ownedCourses.includes(initiatorCourse._id)) {
        console.log(`Initiator ${initiatorStudent._id} no longer owns course ${initiatorCourse._id}`);
        return res.status(400).json({ error: 'Initiator no longer owns the course' });
      }

      if (!receiverStudent.ownedCourses.includes(receiverCourse._id)) {
        console.log(`Receiver ${receiverStudent._id} no longer owns course ${receiverCourse._id}`);
        return res.status(400).json({ error: 'Receiver no longer owns the course' });
      }

      console.log('Both students own their respective courses - proceeding with exchange');

      // Perform the exchange
      // Remove courses from ownedCourses
      initiatorStudent.ownedCourses = initiatorStudent.ownedCourses.filter(
        courseId => !courseId.equals(initiatorCourse._id)
      );
      receiverStudent.ownedCourses = receiverStudent.ownedCourses.filter(
        courseId => !courseId.equals(receiverCourse._id)
      );

      // Add new courses
      initiatorStudent.ownedCourses.push(receiverCourse._id);
      receiverStudent.ownedCourses.push(initiatorCourse._id);

      console.log('Updated ownedCourses for both students');

      // Update community memberships
      // Remove from old communities
      initiatorStudent.communities = initiatorStudent.communities.filter(
        communityId => !communityId.equals(initiatorCourse.community)
      );
      receiverStudent.communities = receiverStudent.communities.filter(
        communityId => !communityId.equals(receiverCourse.community)
      );

      // Add to new communities
      initiatorStudent.communities.push(receiverCourse.community);
      receiverStudent.communities.push(initiatorCourse.community);

      console.log('Updated community memberships for both students');

      // Save students
      await initiatorStudent.save();
      await receiverStudent.save();
      console.log('Saved both student records');

      // Update courses' students lists
      initiatorCourse.students = initiatorCourse.students.filter(
        studentId => !studentId.equals(initiatorStudent._id)
      );
      receiverCourse.students = receiverCourse.students.filter(
        studentId => !studentId.equals(receiverStudent._id)
      );

      initiatorCourse.students.push(receiverStudent._id);
      receiverCourse.students.push(initiatorStudent._id);

      await initiatorCourse.save();
      await receiverCourse.save();
      console.log('Updated and saved both course records');

      // Delete old exchange codes
      await ExchangeCode.deleteMany({ 
        _id: { $in: [initiatorCode._id, receiverCode._id] } 
      });
      console.log('Deleted old exchange codes');

      // Generate new exchange codes
      const newInitiatorCode = new ExchangeCode({
        user: initiatorStudent._id,
        course: receiverCourse._id,
        code: generatePermanentCode(initiatorStudent._id, receiverCourse._id)
      });

      const newReceiverCode = new ExchangeCode({
        user: receiverStudent._id,
        course: initiatorCourse._id,
        code: generatePermanentCode(receiverStudent._id, initiatorCourse._id)
      });

      await newInitiatorCode.save();
      await newReceiverCode.save();
      console.log('Generated and saved new exchange codes');

      // Create transaction record
      const transaction = new Transaction({
        user: exchangeRequest.receiver,
        course: receiverCourse._id,
        transactionType: 'Exchange',
        paymentMethod: 'Exchange',
        exchangeData: exchangeRequest._id,
        status: 'Completed'
      });

      await transaction.save();
      console.log(`Created transaction record: ${transaction._id}`);

      // Update exchange request status
      exchangeRequest.status = 'Accepted';
      exchangeRequest.completedAt = new Date();
      await exchangeRequest.save();
      console.log(`Marked exchange request ${exchangeRequest._id} as completed`);

      return res.status(200).json({ 
        message: 'Course exchange completed successfully',
        transactionId: transaction._id
      });
    }
  } catch (error) {
    console.error('Exchange error:', error);
    if (error.name === 'JsonWebTokenError') {
      console.log('JWT verification failed');
      return res.status(401).json({ error: 'Invalid token' });
    }
    console.log('Internal server error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;