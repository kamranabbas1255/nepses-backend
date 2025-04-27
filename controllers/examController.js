const ExamPaper = require('../models/ExamPaper');
const Question = require('../models/Question');

// Get all exam papers
exports.getExamPapers = async (req, res) => {
  try {
    const { subject, category } = req.query;
    
    // Build query object
    const query = {};
    if (subject) query.subject = subject;
    if (category) query.category = category;
    
    const examPapers = await ExamPaper.find(query)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name');
    
    res.json({
      success: true,
      count: examPapers.length,
      data: examPapers
    });
  } catch (error) {
    console.error('Get exam papers error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get exam paper by ID
exports.getExamPaperById = async (req, res) => {
  try {
    const examPaper = await ExamPaper.findById(req.params.id)
      .populate('questions')
      .populate('createdBy', 'name');
    
    if (!examPaper) {
      return res.status(404).json({ 
        success: false, 
        message: 'Exam paper not found' 
      });
    }
    
    res.json({
      success: true,
      data: examPaper
    });
  } catch (error) {
    console.error('Get exam paper error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Create a new exam paper
exports.createExamPaper = async (req, res) => {
  try {
    const { title, subject, category, questionIds, isAIGenerated, duration } = req.body;
    
    // Validate questions
    if (!questionIds || !Array.isArray(questionIds) || questionIds.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'At least one question is required' 
      });
    }
    
    // Verify all questions exist
    const questions = await Question.find({ _id: { $in: questionIds } });
    if (questions.length !== questionIds.length) {
      return res.status(400).json({ 
        success: false, 
        message: 'One or more question IDs are invalid' 
      });
    }
    
    // Create exam paper
    const examPaper = new ExamPaper({
      title,
      subject,
      category,
      questions: questionIds,
      createdBy: req.user._id,
      isAIGenerated: isAIGenerated || false,
      duration: duration || 60
    });
    
    await examPaper.save();
    
    res.status(201).json({
      success: true,
      data: examPaper
    });
  } catch (error) {
    console.error('Create exam paper error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Update an exam paper
exports.updateExamPaper = async (req, res) => {
  try {
    const { title, subject, category, questionIds, duration } = req.body;
    
    // Validate questions if provided
    if (questionIds) {
      if (!Array.isArray(questionIds) || questionIds.length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'At least one question is required' 
        });
      }
      
      // Verify all questions exist
      const questions = await Question.find({ _id: { $in: questionIds } });
      if (questions.length !== questionIds.length) {
        return res.status(400).json({ 
          success: false, 
          message: 'One or more question IDs are invalid' 
        });
      }
    }
    
    // Build update object
    const updateObj = {};
    if (title) updateObj.title = title;
    if (subject) updateObj.subject = subject;
    if (category) updateObj.category = category;
    if (questionIds) updateObj.questions = questionIds;
    if (duration) updateObj.duration = duration;
    
    // Find and update exam paper
    const examPaper = await ExamPaper.findByIdAndUpdate(
      req.params.id,
      updateObj,
      { new: true, runValidators: true }
    ).populate('questions');
    
    if (!examPaper) {
      return res.status(404).json({ 
        success: false, 
        message: 'Exam paper not found' 
      });
    }
    
    res.json({
      success: true,
      data: examPaper
    });
  } catch (error) {
    console.error('Update exam paper error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Delete an exam paper
exports.deleteExamPaper = async (req, res) => {
  try {
    const examPaper = await ExamPaper.findByIdAndDelete(req.params.id);
    
    if (!examPaper) {
      return res.status(404).json({ 
        success: false, 
        message: 'Exam paper not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Exam paper deleted successfully'
    });
  } catch (error) {
    console.error('Delete exam paper error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Generate exam paper from question bank
exports.generateExamPaper = async (req, res) => {
  try {
    const { title, subject, category, difficulty, questionCount, duration } = req.body;
    
    if (!title || !subject || !category || !questionCount) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title, subject, category, and questionCount are required' 
      });
    }
    
    // Build query for questions
    const query = { subject, category };
    if (difficulty) query.difficulty = difficulty;
    
    // Find questions for the paper
    const questions = await Question.find(query);
    
    if (questions.length < questionCount) {
      return res.status(400).json({ 
        success: false, 
        message: `Not enough questions available. Found ${questions.length}, but ${questionCount} required.` 
      });
    }
    
    // Randomly select questions
    const selectedQuestions = [];
    const availableQuestions = [...questions];
    
    for (let i = 0; i < questionCount; i++) {
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      selectedQuestions.push(availableQuestions[randomIndex]._id);
      availableQuestions.splice(randomIndex, 1);
    }
    
    // Create the exam paper
    const examPaper = new ExamPaper({
      title,
      subject,
      category,
      questions: selectedQuestions,
      createdBy: req.user._id,
      isAIGenerated: true,
      duration: duration || 60
    });
    
    await examPaper.save();
    
    res.status(201).json({
      success: true,
      data: examPaper
    });
  } catch (error) {
    console.error('Generate exam paper error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
}; 