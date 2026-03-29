import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { connectDB } from './config/db.js';
import authRoutes from './routes/Auth.js';
import cors from 'cors';


const app = express();

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173"
}));
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(process.env.PORT, () => {
    connectDB();
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});