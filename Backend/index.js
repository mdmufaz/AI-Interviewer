import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { connectDB } from './config/db.js';
import authRoutes from './routes/Auth.js';
import cors from 'cors';
import interviewRoutes from './routes/interview.js';
import resumeRoutes from './routes/resume.js';
import { mkdirSync } from 'fs';

mkdirSync('uploads', { recursive: true });


const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://ai-interviewer-amber-xi.vercel.app",
    "https://ai-interviewer-bhcya09p7-mufaz.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use('/api/auth', authRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/resume', resumeRoutes);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(process.env.PORT || 5000, () => {
    connectDB();
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});