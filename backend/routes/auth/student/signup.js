const express = require('express');
const bcrypt = require('bcrypt');
const Student = require('../../../models/Student');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const {
      email,
      password,
      username,
      walletAddress,
      bio,
      github,
      linkedin,
      twitter,
      portfolio
    } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ error: 'Email, password, and username are required.' });
    }

    const existingStudent = await Student.findOne({ $or: [{ email }, { username }] });
    if (existingStudent) {
      return res.status(400).json({ error: 'Student with this email or username already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newStudent = new Student({
      email,
      password: hashedPassword,
      username,
      walletAddress,
      leaderboardPoints: 100,
      coins: 100,
      badges: {
        level1: true,
      },
      profile: {
        bio,
        image: req.file ? req.file.path : null,
        socialLinks: {
          github,
          linkedin,
          twitter,
          portfolio
        }
      }
    });

    await newStudent.save();

    res.status(201).json({
      message: 'Student registered successfully!',
      studentId: newStudent._id,
      coins: newStudent.coins,
      level1: true,
      profileImage: req.file ? req.file.path : null
    });
  } catch (err) {
    console.error(err);

    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Maximum 5MB allowed.' });
      }
      return res.status(400).json({ error: err.message });
    }

    res.status(500).json({
      error: err.message || 'Server error. Please try again later.'
    });
  }
});

module.exports = router;