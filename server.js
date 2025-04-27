const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/questions');
const examRoutes = require('./routes/exams');
// const studentRoutes = require('./routes/students');
const assignmentRoutes = require('./routes/assignments');
// const resultRoutes = require('./routes/results');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
// --- SECURE CORS CONFIGURATION ---
const allowedOrigin = 'http://localhost:8098';
const corsOptions = {
  origin: allowedOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
// --- END CORS CONFIGURATION ---

// CORS test route
app.get('/test-cors', (req, res) => {
  res.json({ message: 'CORS is working!' });
});
app.use(express.json());

// Test CORS route
app.get('/test-cors', (req, res) => {
  res.json({ message: 'CORS is working!' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nepses')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/ai', require('./routes/ai'));
// app.use('/api/students', studentRoutes);
app.use('/api/assignments', assignmentRoutes);
// app.use('/api/results', resultRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('NEPSES API Server is running');
});

// Start the server
const PORT = 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 