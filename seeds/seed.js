const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');
const Question = require('../models/Question');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nepses')
  .then(() => console.log('Connected to MongoDB for seeding'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Initial admin users
const adminUsers = [
  {
    name: 'Admin User',
    username: 'admin',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'Moderator User',
    username: 'moderator',
    password: 'mod123',
    role: 'moderator'
  }
];

// Initial students
const students = [
  {
    name: 'John Doe',
    cnic: '1234567890123',
    password: 'student123',
    role: 'student'
  },
  {
    name: 'Jane Smith',
    cnic: '9876543210987',
    password: 'student123',
    role: 'student'
  },
  {
    name: 'Ali Ahmed',
    cnic: '3456789012345',
    password: 'student123',
    role: 'student'
  }
];

// Initial questions
const questions = [
  // English Questions
  {
    text: 'Choose the correct spelling:',
    options: ['Accomodate', 'Accommodate', 'Acommodate', 'Acomodate'],
    correctOption: 1,
    category: 'Junior Clerk',
    subject: 'English',
    difficulty: 'Medium'
  },
  {
    text: 'What is the meaning of "ephemeral"?',
    options: ['Lasting a long time', 'Short-lived', 'Transparent', 'Powerful'],
    correctOption: 1,
    category: 'Junior Clerk',
    subject: 'English',
    difficulty: 'Hard'
  },
  // General Knowledge Questions
  {
    text: 'What is the capital of Pakistan?',
    options: ['Karachi', 'Lahore', 'Islamabad', 'Peshawar'],
    correctOption: 2,
    category: 'Junior Clerk',
    subject: 'General Knowledge',
    difficulty: 'Easy'
  },
  {
    text: 'When was Pakistan formed?',
    options: ['1945', '1946', '1947', '1948'],
    correctOption: 2,
    category: 'Junior Clerk',
    subject: 'General Knowledge',
    difficulty: 'Easy'
  },
  // Computer Questions
  {
    text: 'What does CPU stand for?',
    options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Personal Unit', 'Computing Processing Unit'],
    correctOption: 0,
    category: 'Junior Clerk',
    subject: 'Computer',
    difficulty: 'Easy'
  },
  {
    text: 'Which of the following is an input device?',
    options: ['Printer', 'Monitor', 'Speaker', 'Keyboard'],
    correctOption: 3,
    category: 'Junior Clerk',
    subject: 'Computer',
    difficulty: 'Easy'
  }
];

// Seed users
const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});
    console.log('Deleted existing users');

    // Create admin users
    for (const admin of adminUsers) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(admin.password, salt);
      
      await User.create({
        ...admin,
        password: hashedPassword
      });
    }
    
    // Create students
    for (const student of students) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(student.password, salt);
      
      await User.create({
        ...student,
        password: hashedPassword
      });
    }
    
    console.log('Users seeded successfully');
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

// Seed questions
const seedQuestions = async () => {
  try {
    // Clear existing questions
    await Question.deleteMany({});
    console.log('Deleted existing questions');
    
    // Create questions
    await Question.insertMany(questions);
    
    console.log('Questions seeded successfully');
  } catch (error) {
    console.error('Error seeding questions:', error);
  }
};

// Run the seed functions
const seedAll = async () => {
  try {
    await seedUsers();
    await seedQuestions();
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedAll(); 