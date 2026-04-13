import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
  userId: String,
  score: Number,
  feedback: String,
  date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Interview", interviewSchema);