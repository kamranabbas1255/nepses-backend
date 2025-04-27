const mongoose = require('mongoose');

const examPaperSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isAIGenerated: {
    type: Boolean,
    default: false
  },
  duration: {
    type: Number,
    default: 60,  // Default duration in minutes
    min: 5,
    max: 240
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ExamPaper = mongoose.model('ExamPaper', examPaperSchema);

module.exports = ExamPaper; 