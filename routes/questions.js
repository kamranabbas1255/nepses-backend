const express = require('express');
const { 
  getQuestions, 
  getQuestionById, 
  createQuestion, 
  updateQuestion, 
  deleteQuestion, 
  createBulkQuestions 
} = require('../controllers/questionController');
const { auth, staff } = require('../middleware/auth');

const router = express.Router();

// Get all questions
// GET /api/questions
router.get('/', getQuestions);

// Get question by ID
// GET /api/questions/:id
router.get('/:id', getQuestionById);

// Create a new question
// POST /api/questions
router.post('/', auth, staff, createQuestion);

// Update a question
// PUT /api/questions/:id
router.put('/:id', auth, staff, updateQuestion);

// Delete a question
// DELETE /api/questions/:id
router.delete('/:id', auth, staff, deleteQuestion);

// Create multiple questions (bulk)
// POST /api/questions/bulk
router.post('/bulk', auth, staff, createBulkQuestions);

module.exports = router; 