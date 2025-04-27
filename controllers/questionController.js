const Question = require('../models/Question');

// Get all questions
exports.getQuestions = async (req, res) => {
  try {
    const { subject, category, difficulty } = req.query;
    
    // Build query object
    const query = {};
    if (subject) query.subject = subject;
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    
    const questions = await Question.find(query).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get question by ID
exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ 
        success: false, 
        message: 'Question not found' 
      });
    }
    
    res.json({
      success: true,
      data: question
    });
  } catch (error) {
    console.error('Get question error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Create a new question
exports.createQuestion = async (req, res) => {
  try {
    const { text, options, correctOption, subject, category, difficulty, isAIGenerated } = req.body;
    
    // Create question
    const question = new Question({
      text,
      options,
      correctOption,
      subject,
      category,
      difficulty,
      isAIGenerated: isAIGenerated || false,
      createdBy: req.user._id
    });
    
    await question.save();
    
    res.status(201).json({
      success: true,
      data: question
    });
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Update a question
exports.updateQuestion = async (req, res) => {
  try {
    const { text, options, correctOption, subject, category, difficulty } = req.body;
    
    // Find and update question
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { text, options, correctOption, subject, category, difficulty },
      { new: true, runValidators: true }
    );
    
    if (!question) {
      return res.status(404).json({ 
        success: false, 
        message: 'Question not found' 
      });
    }
    
    res.json({
      success: true,
      data: question
    });
  } catch (error) {
    console.error('Update question error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Delete a question
exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    
    if (!question) {
      return res.status(404).json({ 
        success: false, 
        message: 'Question not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Create multiple questions (bulk)
exports.createBulkQuestions = async (req, res) => {
  try {
    const { questions } = req.body;
    
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Questions array is required' 
      });
    }
    
    // Add createdBy to each question
    const processedQuestions = questions.map(q => ({
      ...q,
      createdBy: req.user._id
    }));
    
    // Insert many questions
    const result = await Question.insertMany(processedQuestions);
    
    res.status(201).json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (error) {
    console.error('Create bulk questions error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
}; 