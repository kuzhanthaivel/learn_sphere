const mongoose = require('mongoose');

const CommunitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, maxlength: 500 },
  coverImage: { type: String },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, refPath: 'members.userType' },
    userType: { type: String, enum: ['Student', 'Creator'] },
    joinedAt: { type: Date, default: Date.now },
    role: { type: String, enum: ['Student', 'Creator'], default: 'Student' }
  }],
  messages: [{
    user: { type: mongoose.Schema.Types.ObjectId, refPath: 'messages.userType' },
    userType: { type: String, enum: ['Student', 'Creator'] },
    content: { type: String, required: true, maxlength: 1000 },
    createdAt: { type: Date, default: Date.now },
  }],
  createdAt: { type: Date, default: Date.now }
});

CommunitySchema.index({ name: 'text' });

module.exports = mongoose.model('Community', CommunitySchema);