const express = require('express');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const Creator = require('../../../models/Creator'); 

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
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
  limits: { fileSize: 1024 * 1024 * 5 }, 
  fileFilter: fileFilter,
});


router.post('/', upload.single('image'), async (req, res) => {
    try {
      const { professionalName, email, password, walletAddress, bio, socialLinks } = req.body;
      if (!professionalName || !email || !password) {
        return res.status(400).json({ error: 'Professional name, email, and password are required.' });
      }
  
      const existingCreator = await Creator.findOne({ $or: [{ email }, { professionalName }] });
      if (existingCreator) {
        return res.status(400).json({ error: 'Email or professional name already in use.' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newCreator = new Creator({
        professionalName,
        email,
        password: hashedPassword,
        walletAddress,
        profile: {
          bio,
          image: req.file ? req.file.path : null,
          socialLinks: JSON.parse(socialLinks || '{}'), 
        },
      });
  

      await newCreator.save();
  
      res.status(201).json({
        message: 'Signup successful',
        creator: {
          id: newCreator._id,
          email: newCreator.email,
          profileImage: req.file ? req.file.path : null,
        },
      });
    } catch (error) {
      console.error(error);
  
      if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'File too large. Maximum 5MB allowed.' });
        }
        return res.status(400).json({ error: error.message });
      }
  
      res.status(500).json({ error: error.message || 'Server error. Please try again later.' });
    }
  });
  
  module.exports = router;
  