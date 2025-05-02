const express = require('express');
const jwt = require('jsonwebtoken');
const Course = require('../../models/Course');
const Community = require('../../models/Community');
const Creator = require('../../models/Creator');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const coverImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/course-covers/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'cover-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/course-videos/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'video-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const videoFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Not a video! Please upload only videos.'), false);
  }
};

const uploadCoverImage = multer({
  storage: coverImageStorage,
  limits: { fileSize: 1024 * 1024 * 10 },
  fileFilter: imageFilter,
}).single('coverImage');

const uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 1024 * 1024 * 100 },
  fileFilter: videoFilter,
}).array('syllabusVideos', 10);

const verifyCreatorToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};

router.post('/', async (req, res) => {

  uploadCoverImage(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = verifyCreatorToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    const creator = await Creator.findById(decoded.id);
    if (!creator) {
      return res.status(404).json({
        success: false,
        message: 'Creator not found'
      });
    }

    const {
      title,
      shortDescription,
      fullDescription,
      category,
      price,
      discount,
      rating,
      syllabus,
      communityName
    } = req.body;

    if (!title || !shortDescription || !fullDescription || !category || !price) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    let syllabusArray;
    try {
      syllabusArray = Array.isArray(syllabus) ? syllabus : JSON.parse(syllabus || '[]');
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: 'Invalid syllabus format'
      });
    }

    if (!syllabusArray.length) {
      return res.status(400).json({
        success: false,
        message: 'At least one syllabus item is required'
      });
    }

    for (const item of syllabusArray) {
      if (!item.title || (!item.videoUrl && !item.videoFile)) {
        return res.status(400).json({
          success: false,
          message: 'Each syllabus item must have a title and either videoUrl or videoFile'
        });
      }
    }

    const processVideoUploads = async () => {
      return new Promise((resolve, reject) => {
        uploadVideo(req, res, async (err) => {
          if (err) {
            reject(err);
            return;
          }

          const files = req.files || [];
          const videoFileMap = {};

          files.forEach(file => {
            const match = file.fieldname.match(/syllabusVideos\[(\d+)\]/);
            if (match) {
              const index = parseInt(match[1]);
              videoFileMap[index] = file.path;
            }
          });

          const processedSyllabus = syllabusArray.map((item, index) => {
            if (item.videoFile && videoFileMap[index] !== undefined) {
              return {
                ...item,
                videoFile: videoFileMap[index],
                videoUrl: item.videoUrl || null
              };
            }
            return item;
          });

          resolve(processedSyllabus);
        });
      });
    };

    try {
      const processedSyllabus = await processVideoUploads();

      const community = new Community({
        name: communityName || `${title} Community`,
        description: `Community for ${title} course`,
        members: [{
          user: creator._id,
          userType: 'Creator',
          role: 'Creator',
          joinedAt: Date.now()
        }],
        messages: []
      });

      const savedCommunity = await community.save();

      creator.communities.push(savedCommunity._id);
      await creator.save();

      const course = new Course({
        title,
        shortDescription,
        fullDescription,
        category,
        price,
        discount: discount || 0,
        rating: rating || 0,
        instructor: creator._id,
        community: savedCommunity._id,
        syllabus: processedSyllabus.map((item, index) => ({
          S_no: index + 1,
          title: item.title,
          videoUrl: item.videoUrl || null,
          videoFile: item.videoFile || null
        })),
        coverImage: req.file ? req.file.path : null
      });

      const savedCourse = await course.save();

      creator.createdCourses.push(savedCourse._id);
      await creator.save();

      return res.status(201).json({
        success: true,
        message: 'Course and community created successfully',
        data: {
          course: savedCourse,
          community: savedCommunity
        }
      });

    } catch (error) {
      console.error('Error creating course:', error);
      return res.status(500).json({
        success: false,
        message: 'Error creating course',
        error: error.message
      });
    }
  });
});

module.exports = router;