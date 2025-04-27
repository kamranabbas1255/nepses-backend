const express = require('express');
const { register, studentLogin, adminLogin, getMe } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Register a new user
// POST /api/auth/register
router.post('/register', register);

// Student login
// POST /api/auth/student/login
router.post('/student/login', studentLogin);

// Admin/moderator login
// POST /api/auth/admin/login
router.post('/admin/login', adminLogin);

// Get current user profile
// GET /api/auth/me
router.get('/me', auth, getMe);

module.exports = router; 