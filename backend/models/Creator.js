
const mongoose = require('mongoose');

const CreatorSchema = new mongoose.Schema({
  professionalName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  walletAddress: { type: String, unique: true, sparse: true },
  token: { type: String },
  createdCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  profile: {
    bio: { type: String, maxlength: 1000 },
    image: { type: String },
    socialLinks: {
      youtube: { type: String },
      linkedin: { type: String },
      twitter: { type: String },
      website: { type: String }
    },
  },
  createdAt: { type: Date, default: Date.now },
});

CreatorSchema.index({ professionalName: 1, email: 1 });

module.exports = mongoose.model('Creator', CreatorSchema);