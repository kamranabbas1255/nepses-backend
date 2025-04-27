# NEPSES Backend API

Backend server for the NEPSES (National Examination System) application.

## Setup Instructions

### Prerequisites
- Node.js (v14.x or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. Clone the repository (if you haven't already)
2. Navigate to the backend directory:
   ```
   cd NEPSES2.1/backend
   ```
3. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```
4. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/nepses
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   NODE_ENV=development
   ```
   Note: Replace the values with your own configuration.

### Running the Server

#### Development mode
```
npm run dev
```
or
```
yarn dev
```

#### Production mode
```
npm start
```
or
```
yarn start
```

### Seeding the Database

To populate the database with initial data:
```
npm run seed
```
or
```
yarn seed
```

This will create:
- Admin users (username: admin, password: admin123)
- Moderator users (username: moderator, password: mod123)
- Sample students (CNIC: 1234567890123, password: student123)
- Sample questions

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/student/login` - Student login
- POST `/api/auth/admin/login` - Admin/Moderator login
- GET `/api/auth/me` - Get current user profile

### Questions
- GET `/api/questions` - Get all questions
- GET `/api/questions/:id` - Get question by ID
- POST `/api/questions` - Create a new question (staff only)
- PUT `/api/questions/:id` - Update a question (staff only)
- DELETE `/api/questions/:id` - Delete a question (staff only)
- POST `/api/questions/bulk` - Create multiple questions (staff only)

### Exam Papers
- GET `/api/exams` - Get all exam papers
- GET `/api/exams/:id` - Get exam paper by ID
- POST `/api/exams` - Create a new exam paper (staff only)
- PUT `/api/exams/:id` - Update an exam paper (staff only)
- DELETE `/api/exams/:id` - Delete an exam paper (staff only)
- POST `/api/exams/generate` - Generate exam paper (staff only)

### Assignments
- GET `/api/assignments` - Get all assignments (staff only)
- GET `/api/assignments/:id` - Get assignment by ID
- GET `/api/assignments/student/:studentId` - Get assignments for a student
- POST `/api/assignments` - Create a new assignment (staff only)
- PUT `/api/assignments/:id` - Update assignment status
- POST `/api/assignments/bulk` - Bulk assign exam (staff only)

## Models

### User
- name: User's full name
- username: Username (for admin/moderator)
- cnic: CNIC number (for students)
- password: Hashed password
- role: "student", "moderator", or "admin"

### Question
- text: Question text
- options: Array of option strings
- correctOption: Index of correct option
- subject: Subject category
- category: Job category
- difficulty: "Easy", "Medium", or "Hard"

### ExamPaper
- title: Exam title
- subject: Subject
- category: Job category
- questions: Array of Question references
- duration: Exam duration in minutes

### Assignment
- examId: Reference to ExamPaper
- studentId: Reference to User
- status: "scheduled", "in-progress", or "completed"
- dueDate: Assignment due date
- progress: Completion percentage 