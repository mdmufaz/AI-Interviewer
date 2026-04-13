import express from "express";
import dotenv from "dotenv";
import openai from "../config/openrouter.js";
import Interview from "../models/Interview.js";
dotenv.config();

const router = express.Router();


// ✅ Start Interview
router.post("/start", async (req, res) => {
  try {
    const { topic, difficulty, type, numQuestions } = req.body;

    const prompt = `
You are an interviewer.

Generate ${numQuestions} ${difficulty} level ${type} questions on "${topic}".

Rules:
- If type is "mcq":
  Return format:
  [
    {
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "answer": "correct option"
    }
  ]

- If type is "theory":
  Return format:
  [
    {
      "question": "..."
    }
  ]

Return ONLY JSON.
`;

    const completion = await openai.chat.completions.create({
model: "openai/gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
    });

    let result = completion.choices[0].message.content;

    let parsed;

    try {
      parsed = JSON.parse(result);
    } catch (err) {
      const match = result.match(/\[[\s\S]*\]/);
      parsed = match ? JSON.parse(match[0]) : null;
    }

    // ✅ fallback only if AI fails
    if (!parsed || !Array.isArray(parsed)) {
      parsed = Array.from({ length: numQuestions }, (_, i) => ({
        question: `Sample question ${i + 1} about ${topic}`,
        type,
      }));
    }

    // ✅ keep options for MCQ
    const questions = parsed.map((q) => ({
      question: q.question,
      type,
      options: q.options || [],
      answer: q.answer || null,
    }));

    res.status(200).json({
      message: "Interview started",
      questions,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});


// ✅ Submit Interview (AI Evaluation)
router.post("/submit", async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || answers.length === 0) {
      return res.status(400).json({ message: "No answers provided" });
    }

    // ✅ Convert Q&A into proper format
    const formattedQA = answers
      .map((item, index) => {
        return `Q${index + 1}: ${item.question}\nA${index + 1}: ${item.answer}`;
      })
      .join("\n\n");

    const prompt = `
You are a strict technical interviewer.

IMPORTANT RULES:
- Evaluate based on BOTH question and answer
- Return ONLY JSON
- No extra text
- No explanation

Format:
{
  "score": number,
  "feedback": "text",
  "improvements": ["point1", "point2", "point3"]
}

Evaluate the following:

${formattedQA}
`;

    const completion = await openai.chat.completions.create({
  model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
    });

    let result = completion.choices[0].message.content;

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

    // ✅ Safe fallback
    if (!parsed) {
      parsed = {
        score: 60,
        feedback: "Decent attempt but evaluation formatting failed.",
        improvements: [
          "Be more clear",
          "Add examples",
          "Improve explanation"
        ]
      };
    }
    await Interview.create({
  userId: "demo-user", // later we improve
  score: parsed.score,
  feedback: parsed.feedback
});
    res.json(parsed);

  } catch (error) {
    console.error("FULL ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});

router.get("/history", async (req, res) => {
  try {
    const data = await Interview.find({
      userId: "demo-user"
    }).sort({ date: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
});
export default router;