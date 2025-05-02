const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Course = require('../../models/Course');

router.get('/:id', async (req, res) => {
  try {
    const courseId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: 'Invalid course ID format' });
    }

    const course = await Course.findById(courseId)
      .select('title shortDescription fullDescription discount category syllabus coverImage price')
      .exec();

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;