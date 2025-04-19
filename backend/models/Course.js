const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    shortDescription: { type: String, maxlength: 200 },
    fullDescription: { type: String, maxlength: 2000 },
    category: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, min: 0, max: 100, default: 0 },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'Creator', required: true },
    community: { type: mongoose.Schema.Types.ObjectId, ref: 'Community', required: true },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    syllabus: [{
        S_no: Number,
        title: String,
        videoUrl: String, 
      }],
    coverImage: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  });
module.exports = mongoose.model('Course', courseSchema);