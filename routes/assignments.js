const express = require('express');
const { 
  getAssignments, 
  getAssignmentById, 
  getStudentAssignments, 
  createAssignment, 
  updateAssignmentStatus, 
  bulkAssignExam 
} = require('../controllers/assignmentController');
const { auth, staff, student } = require('../middleware/auth');

const router = express.Router();

// Get all assignments (staff only)
// GET /api/assignments
router.get('/', auth, staff, getAssignments);

// Get assignment by ID
// GET /api/assignments/:id
router.get('/:id', auth, getAssignmentById);

// Get assignments for a student
// GET /api/assignments/student/:studentId
router.get('/student/:studentId', auth, getStudentAssignments);

// Create a new assignment (staff only)
// POST /api/assignments
router.post('/', auth, staff, createAssignment);

// Update assignment status
// PUT /api/assignments/:id
router.put('/:id', auth, updateAssignmentStatus);

// Bulk assign exam to multiple students (staff only)
// POST /api/assignments/bulk
router.post('/bulk', auth, staff, bulkAssignExam);

module.exports = router; 