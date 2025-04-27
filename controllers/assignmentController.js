const Assignment = require('../models/Assignment');
const ExamPaper = require('../models/ExamPaper');
const User = require('../models/User');

// Get all assignments
exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate('examId', 'title subject category')
      .populate('studentId', 'name cnic')
      .sort({ assignedAt: -1 });
    
    res.json({
      success: true,
      count: assignments.length,
      data: assignments
    });
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get assignment by ID
exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('examId')
      .populate('studentId', 'name cnic');
    
    if (!assignment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Assignment not found' 
      });
    }
    
    res.json({
      success: true,
      data: assignment
    });
  } catch (error) {
    console.error('Get assignment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get assignments for a student
exports.getStudentAssignments = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // Verify student exists
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ 
        success: false, 
        message: 'Student not found' 
      });
    }
    
    const assignments = await Assignment.find({ studentId })
      .populate('examId', 'title subject category duration')
      .sort({ assignedAt: -1 });
    
    res.json({
      success: true,
      count: assignments.length,
      data: assignments
    });
  } catch (error) {
    console.error('Get student assignments error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Create a new assignment
exports.createAssignment = async (req, res) => {
  try {
    const { examId, studentId, dueDate } = req.body;
    
    // Verify exam exists
    const exam = await ExamPaper.findById(examId);
    if (!exam) {
      return res.status(404).json({ 
        success: false, 
        message: 'Exam paper not found' 
      });
    }
    
    // Verify student exists
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ 
        success: false, 
        message: 'Student not found' 
      });
    }
    
    // Check if assignment already exists
    const existingAssignment = await Assignment.findOne({ examId, studentId });
    if (existingAssignment) {
      return res.status(400).json({ 
        success: false, 
        message: 'This exam is already assigned to this student' 
      });
    }
    
    // Create assignment
    const assignment = new Assignment({
      examId,
      studentId,
      dueDate,
      assignedBy: req.user._id
    });
    
    await assignment.save();
    
    res.status(201).json({
      success: true,
      data: assignment
    });
  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Update assignment status
exports.updateAssignmentStatus = async (req, res) => {
  try {
    const { status, progress, timeRemaining, answers, currentQuestionIndex } = req.body;
    
    // Find assignment
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Assignment not found' 
      });
    }
    
    // Update fields
    if (status) assignment.status = status;
    if (progress !== undefined) assignment.progress = progress;
    if (timeRemaining !== undefined) assignment.timeRemaining = timeRemaining;
    if (answers) assignment.answers = answers;
    if (currentQuestionIndex !== undefined) assignment.currentQuestionIndex = currentQuestionIndex;
    
    // Update timestamps based on status
    if (status === 'in-progress' && !assignment.startedAt) {
      assignment.startedAt = new Date();
    } else if (status === 'completed' && !assignment.completedAt) {
      assignment.completedAt = new Date();
    }
    
    await assignment.save();
    
    res.json({
      success: true,
      data: assignment
    });
  } catch (error) {
    console.error('Update assignment status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Bulk assign exam to multiple students
exports.bulkAssignExam = async (req, res) => {
  try {
    const { examId, studentIds, dueDate } = req.body;
    
    if (!examId || !studentIds || !Array.isArray(studentIds) || !dueDate) {
      return res.status(400).json({ 
        success: false, 
        message: 'ExamId, studentIds array, and dueDate are required' 
      });
    }
    
    // Verify exam exists
    const exam = await ExamPaper.findById(examId);
    if (!exam) {
      return res.status(404).json({ 
        success: false, 
        message: 'Exam paper not found' 
      });
    }
    
    // Verify students exist
    const students = await User.find({ 
      _id: { $in: studentIds },
      role: 'student'
    });
    
    if (students.length !== studentIds.length) {
      return res.status(400).json({ 
        success: false, 
        message: 'One or more student IDs are invalid' 
      });
    }
    
    // Create assignments in bulk
    const existingAssignments = await Assignment.find({
      examId,
      studentId: { $in: studentIds }
    });
    
    const existingStudentIds = existingAssignments.map(a => a.studentId.toString());
    const newStudentIds = studentIds.filter(id => !existingStudentIds.includes(id.toString()));
    
    const assignments = [];
    for (const studentId of newStudentIds) {
      assignments.push({
        examId,
        studentId,
        dueDate,
        assignedBy: req.user._id
      });
    }
    
    let result = [];
    if (assignments.length > 0) {
      result = await Assignment.insertMany(assignments);
    }
    
    res.status(201).json({
      success: true,
      count: result.length,
      data: result,
      skipped: studentIds.length - newStudentIds.length,
      message: `Assigned exam to ${result.length} student(s). ${studentIds.length - newStudentIds.length} assignment(s) already existed.`
    });
  } catch (error) {
    console.error('Bulk assign exam error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
}; 