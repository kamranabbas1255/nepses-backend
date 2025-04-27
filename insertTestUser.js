// This script will insert a test user into the 'users' collection of the 'nepses' database.
// Run this file with: node insertTestUser.js

const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/nepses';

// Define a simple user schema inline (for testing)
const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  cnic: String,
  password: String,
  role: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function insertTestUser() {
  try {
    await mongoose.connect(uri);
    const user = new User({
      name: 'Test User',
      username: 'testuser',
      cnic: '12345-6789012-3',
      password: 'testpassword',
      role: 'student'
    });
    await user.save();
    console.log('Test user inserted!');
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error inserting test user:', err);
  }
}

insertTestUser();
