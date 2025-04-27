const express = require('express');
const { 
  getExamPapers, 
  getExamPaperById, 
  createExamPaper, 
  updateExamPaper, 
  deleteExamPaper, 
  generateExamPaper 
} = require('../controllers/examController');
const { auth, staff } = require('../middleware/auth');

const router = express.Router();

// Get all exam papers
// GET /api/exams
router.get('/', getExamPapers);

// Get exam paper by ID
// GET /api/exams/:id
router.get('/:id', getExamPaperById);

// Create a new exam paper
// POST /api/exams
router.post('/', auth, staff, createExamPaper);

// Update an exam paper
// PUT /api/exams/:id
router.put('/:id', auth, staff, updateExamPaper);

// Delete an exam paper
// DELETE /api/exams/:id
router.delete('/:id', auth, staff, deleteExamPaper);

// Generate exam paper from question bank
// POST /api/exams/generate
router.post('/generate', auth, staff, generateExamPaper);

module.exports = router; 