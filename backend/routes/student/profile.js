const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Student = require('../../models/Student');
const Course = require('../../models/Course');

router.get('/', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const student = await Student.findById(decoded.id)

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const completedCoursesWithDetails = await Promise.all(
      student.completedCourses.map(async (completedCourse) => {
        const course = await Course.findById(completedCourse.course)
          .select('title category coverImage');
        return {
          certificateID: completedCourse.certificateID,
          title: course?.title || 'Deleted Course',
          category: course?.category || 'N/A',
          coverImage: course?.coverImage || '',
          completedAt: completedCourse.completedAt
        };
      })
    );

    const leaderboard = await Student.find()
      .select('username leaderboardPoints profile.image')
      .sort({ leaderboardPoints: -1 });

    const userIndex = leaderboard.findIndex(u => u._id.toString() === student._id.toString());
    const userPosition = userIndex + 1;

    const leaderboardEntries = [];
    const totalUsers = leaderboard.length;

    if (userIndex >= 0) {
      leaderboardEntries.push({
        name: student.username,
        place: userPosition,
        score: student.leaderboardPoints,
        image: student.profile?.image || null
      });
    }

    for (let i = 1; i <= 2; i++) {
      const nextIndex = (userIndex + i) % totalUsers;
      if (nextIndex >= 0 && leaderboard[nextIndex]) {
        leaderboardEntries.push({
          name: leaderboard[nextIndex].username,
          place: nextIndex + 1,
          score: leaderboard[nextIndex].leaderboardPoints,
          image: leaderboard[nextIndex].profile?.image || null
        });
      }
    }

    const response = {
      id: student._id,
      username: student.username,
      badges: student.badges,
      profile: student.profile,
      completedCourses: completedCoursesWithDetails,
      leaderboard: leaderboardEntries
    };

    res.json(response);

  } catch (error) {
    console.error('Profile error:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }

    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;