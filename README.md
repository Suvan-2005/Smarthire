Hire – AI Based Resume Screening and Hiring Platform

Overview

Hire is a web-based recruitment platform that helps companies streamline the hiring process by automatically analyzing resumes and matching candidates with job requirements.

The system allows recruiters to upload job descriptions and candidates to upload resumes. The backend processes the resumes and extracts useful information to assist in candidate evaluation.

This project is built using React (frontend) and Node.js with Express (backend), with MongoDB used as the database.

Features

👤 User Authentication (JWT based login/signup)

📄 Resume Upload (PDF support)

🧠 Resume Parsing using pdf-parse

📊 Candidate Data Storage using MongoDB

🔐 Secure Password Hashing using bcrypt

🌐 REST API for communication between frontend and backend

📈 Recruiter dashboard for viewing candidates

!Smart Hire Architecture!
                                                    [Smarthire](https://github.com/user-attachments/assets/1f6ef51d-4187-4175-9730-2380fe67bc03)


Project Architecture
Hire
│
├── frontend
│   ├── React + Vite application
│   ├── Handles UI and user interaction
│   └── Communicates with backend APIs
│
└── backend
    ├── Node.js + Express server
    ├── MongoDB database connection
    ├── Authentication with JWT
    ├── Resume parsing
    └── API routes
🛠️ Tech Stack
Frontend

React

Vite

Axios

React Router DOM

Recharts

Lucide React Icons

Backend

Node.js

Express.js

MongoDB

Mongoose

JSON Web Token (JWT)

Bcrypt

Multer (file uploads)

pdf-parse (resume parsing)

Installation
1️⃣ Clone the Repository
git clone https://github.com/your-username/hire.git
cd hire
Backend Setup
cd backend
npm install

Create .env file

PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key

Run the server

node server.js
Frontend Setup
cd frontend
npm install
npm run dev

Frontend will run at

http://localhost:5173
📡 API Functionalities
Authentication

User Registration

User Login

JWT Token Authentication

Resume Management

Upload Resume

Extract Resume Data

Store Candidate Information

📁 Important Files
File	Description
server.js	Main backend server
test_api.js	API testing script
vite.config.js	Vite configuration
.env	Environment variables
🔐 Security

Passwords are hashed using bcrypt

Authentication handled using JWT

Sensitive configuration stored in .env files

🎯 Future Improvements

AI-based resume-job matching

Candidate ranking system

Recruiter analytics dashboard

Interview scheduling system

Email notifications

👨‍💻 Author

Developed as a full-stack web application for improving the recruitment workflow.
