
const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
 username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  tokens: { type: String },
  password: { type: String, required: true },
  walletAddress: { type: String },
  coins: { type: Number, default: 0, min: 0 },
  completedCourses: [{ 
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    completedAt: { type: Date, default: Date.now },
    certificate: { type: String }
  }],
  ownedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  rentedCourses: [{
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    expiryDate: { type: Date, required: true },
    rentedAt: { type: Date, default: Date.now }
  }],
  badges: [{type: String}],
  leaderboardPoints: { type: Number, default: 0, min: 0 },
  profile: {
    bio: { type: String, maxlength: 500 },
    image: { type: String },
    socialLinks: {
      github: { type: String },
      linkedin: { type: String },
      twitter: { type: String },
      portfolio: { type: String },
    }
  },
  communities: [String],
  createdAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now }
});

StudentSchema.index({ username: 1, email: 1 });

module.exports = mongoose.model('Student', StudentSchema);