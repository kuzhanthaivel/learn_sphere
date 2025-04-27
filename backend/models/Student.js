const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  token: { type: String },
  password: { type: String, required: true },
  walletAddress: { type: String },
  coins: { type: Number, default: 0, min: 0 },
  completedCourses: { 
    type: [{ 
      course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
      completedAt: { type: Date, default: Date.now },
      certificateID: { type: String }
    }], 
    default: [] 
  },
  ownedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  rentedCourses: { 
    type: [{ 
      course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
      paymentMethod: { type: String, enum: ['coins', 'money'], required: true },
      amountPaid: { type: Number, required: true, min: 0 },
      durationDays: { type: Number, required: true, min: 1 },
      expiryDate: { type: Date, required: true },
      rentedAt: { type: Date, default: Date.now }
    }], 
    default: [] 
  },
  badges: {
    level1: { type: Boolean, default: false },
    level2: { type: Boolean, default: false },
    level3: { type: Boolean, default: false },
    level4: { type: Boolean, default: false },
    level5: { type: Boolean, default: false },
    level6: { type: Boolean, default: false },
    level7: { type: Boolean, default: false },
    level8: { type: Boolean, default: false },
    level9: { type: Boolean, default: false },
    level10: { type: Boolean, default: false },
    level11: { type: Boolean, default: false },
    level12: { type: Boolean, default: false },
    level13: { type: Boolean, default: false },
    level14: { type: Boolean, default: false },
    level15: { type: Boolean, default: false },
  },
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
  communities: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Community' }], default: [] },
  createdAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now }
});

StudentSchema.index({ username: 1, email: 1 });

module.exports = mongoose.model('Student', StudentSchema);