const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Creator = require('../../models/Creator');
const Course = require('../../models/Course');

router.get('/', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const creator = await Creator.findById(decoded.id);

    if (!creator) {
      return res.status(404).json({ error: 'Creator not found' });
    }

    const [courses, stats] = await Promise.all([
      Course.find({ instructor: creator._id })
        .populate('community', '_id')
        .select('title category community students coverImage rating')
        .lean(),
      Promise.all([
        Course.countDocuments({ instructor: creator._id }),
        Course.aggregate([
          { $match: { instructor: creator._id } },
          { $project: { count: { $size: { $ifNull: ["$students", []] } } } },
          { $group: { _id: null, total: { $sum: "$count" } } }
        ]),
        Course.aggregate([
          { $match: { instructor: creator._id, rating: { $gt: 0 } } },
          { $group: { _id: null, average: { $avg: "$rating" } } }
        ])
      ])
    ]);


    const response = {
      success: true,
      data: {
        courses: courses.map(course => ({
          title: course.title,
          category: course.category,
          community: course.community?._id || null,
          studentsCount: course.students?.length || 0,
          coverImage: course.coverImage,
          rating: course.rating,
          courseId: course._id.toString()
        })),
        stats: {
          totalCourses: stats[0],
          totalStudents: stats[1][0]?.total || 0,
          averageRating: stats[2][0]?.average ?
            Math.round(stats[2][0].average * 10) / 10 : 0
        }
      },
      count: courses.length
    };

    res.json(response);

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message
    });
  }
});

module.exports = router;