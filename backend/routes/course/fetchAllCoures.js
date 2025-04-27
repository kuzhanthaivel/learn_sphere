const express = require('express');
const router = express.Router();
const Course = require('../../models/Course'); 

router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({})
      .select('_id title shortDescription category price coverImage rating')
      .lean();
    
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

module.exports = router;