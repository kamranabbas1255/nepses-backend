const express = require('express');
const { generateAIQuestions } = require('../controllers/aiController');
const { auth, staff } = require('../middleware/auth');

const router = express.Router();

// POST /api/ai/generate
router.post('/generate', auth, staff, generateAIQuestions);

module.exports = router;
