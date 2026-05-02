import express from "express";
import dotenv from "dotenv";
import openai from "../config/openrouter.js";
import Interview from "../models/Interview.js";
dotenv.config();

const router = express.Router();

const AI_MODEL = "nvidia/nemotron-3-super-120b-a12b:free";

// ✅ Start Interview
router.post("/start", async (req, res) => {
  try {
    const { topic, difficulty, type, numQuestions } = req.body;

    const prompt = `
Generate ${numQuestions} ${difficulty} ${type} interview questions on "${topic}".

Return ONLY valid JSON.

${type === "mcq" ? `
Format:
[
  {
    "question": "string",
    "options": ["A","B","C","D"],
    "answer": "A"
  }
]
` : `
Format:
[
  {
    "question": "string"
  }
]
`}

Rules:
- No explanation
- No text outside JSON
- Always use double quotes
`;

    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 1000,
    });

    let result = completion.choices[0].message.content;

    let parsed;
    try {
      parsed = JSON.parse(result);
    } catch (err) {
      console.log("Raw AI response:", result);
      const match = result.match(/\[[\s\S]*\]/);
      try {
        parsed = match ? JSON.parse(match[0]) : null;
      } catch {
        parsed = null;
      }
    }

    if (!parsed || !Array.isArray(parsed)) {
      console.log("Using fallback");
      parsed = Array.from({ length: numQuestions }, (_, i) => ({
        question: `Sample question ${i + 1} about ${topic}`,
        options: type === "mcq" ? ["Option A", "Option B", "Option C", "Option D"] : [],
        answer: null
      }));
    }

    const questions = parsed.map((q) => ({
      question: q.question || "No question",
      type,
      options: type === "mcq" ? (q.options || []) : [],
      answer: type === "mcq" ? (q.answer || null) : null,
    }));

    res.status(200).json({ message: "Interview started", questions });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// ✅ Submit Interview
router.post("/submit", async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || answers.length === 0) {
      return res.status(400).json({ message: "No answers provided" });
    }

    const formattedQA = answers
      .map((item, index) => `Q${index + 1}: ${item.question}\nA${index + 1}: ${item.answer}`)
      .join("\n\n");

    const prompt = `
You are a strict but fair technical interviewer.

Evaluate the candidate answers based on correctness, clarity, depth, and examples.

Score from 0 to 100.

Return ONLY valid JSON in this format:
{
  "score": number,
  "feedback": "short overall feedback",
  "improvements": ["point1", "point2", "point3"]
}

Here are the questions and answers:

${formattedQA}
`;

    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    let result = completion.choices[0].message.content;
    console.log("Submit AI raw response:", result);

    let parsed;
    try {
      parsed = JSON.parse(result);
    } catch (err) {
      try {
        const match = result.match(/\{[\s\S]*\}/);
        parsed = match ? JSON.parse(match[0]) : null;
      } catch (e) {
        parsed = null;
      }
    }

    if (!parsed) {
      parsed = {
        score: 60,
        feedback: "Decent attempt but evaluation formatting failed.",
        improvements: ["Be more clear", "Add examples", "Improve explanation"]
      };
    }

    await Interview.create({
      userId: "demo-user",
      score: parsed.score,
      feedback: parsed.feedback
    });

    res.json(parsed);

  } catch (error) {
    console.error("FULL ERROR:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ History
router.get("/history", async (req, res) => {
  try {
    const data = await Interview.find({ userId: "demo-user" }).sort({ date: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
});

// ✅ Search Topic
router.post("/search-topic", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ message: "Query required" });
    }

    const prompt = `
Convert this into a clean technical interview topic.

Input: ${query}

Return ONLY JSON:
{
  "topic": "refined topic"
}
`;

    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 50,
    });

    let result = completion.choices[0].message.content;

    let parsed;
    try {
      parsed = JSON.parse(result);
    } catch {
      const match = result.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : null;
    }

    res.json(parsed || { topic: query });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error searching topic" });
  }
});

// ✅ Start From Resume
router.post("/start-from-resume", async (req, res) => {
  try {
    const { resumeText, resumeData, difficulty, type, numQuestions } = req.body;

    const prompt = `
You are a senior technical interviewer. Based on this candidate's resume, generate ${numQuestions} interview questions.

Candidate Profile:
- Skills: ${resumeData.skills?.join(", ")}
- Projects: ${resumeData.projects?.join(", ")}
- Experience: ${resumeData.experience?.join(", ")}
- Education: ${resumeData.education}

Difficulty: ${difficulty}
Question Type: ${type}

Rules:
- Ask about their ACTUAL skills and projects mentioned
- For MCQ: provide 4 options, mark correct one
- For theory: open ended questions about their specific projects and skills
- Make questions feel like a REAL interview about their background

Return ONLY this JSON format:
{
  "questions": [
    ${type === "mcq"
      ? `{"question": "...", "options": ["A", "B", "C", "D"], "correct": "A", "type": "mcq"}`
      : `{"question": "...", "type": "theory"}`
    }
  ]
}
`;

    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 2000,
    });

    let result = completion.choices[0].message.content;

    let parsed;
    try {
      parsed = JSON.parse(result);
    } catch {
      const match = result.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : null;
    }

    if (!parsed || !parsed.questions) {
      return res.status(500).json({ message: "AI failed to generate questions" });
    }

    return res.json(parsed);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to generate questions from resume" });
  }
});

export default router;