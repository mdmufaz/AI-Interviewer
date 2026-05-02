import express from "express";
import multer from "multer";
import fs from "fs";
import { extractText } from "unpdf";

const router = express.Router();

const upload = multer({
    dest: "uploads/",
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files allowed"), false);
        }
    }
});

router.post("/upload", upload.single("resume"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    try {
        // ✅ STEP 1 - Extract text
        const dataBuffer = fs.readFileSync(req.file.path);
        const uint8Array = new Uint8Array(dataBuffer);
        const { text } = await extractText(uint8Array, { mergePages: true });
        const resumeText = text;

        fs.unlinkSync(req.file.path);

        console.log("=== PDF EXTRACTION ===");
        console.log("Length:", resumeText.length);
        console.log("Preview:", resumeText.slice(0, 300));

        if (!resumeText || resumeText.trim().length < 20) {
            return res.status(400).json({
                message: "Could not extract text. Please use a text-based PDF."
            });
        }

        // ✅ STEP 2 - Call AI
        const prompt = `
You are a resume parser. Extract the following from this resume and return ONLY valid JSON, no explanation, no markdown backticks:

{
  "name": "candidate name",
  "skills": ["skill1", "skill2"],
  "projects": ["project title: brief description"],
  "experience": ["company - role - duration"],
  "education": "degree and college",
  "suggestedTopics": ["topic1", "topic2", "topic3"]
}

Resume:
${resumeText.slice(0, 3000)}
`;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPEN_ROUTER_API_KEY}`,
            },
            body: JSON.stringify({
// ✅ CORRECT
model: "nvidia/nemotron-3-super-120b-a12b:free",                messages: [{ role: "user", content: prompt }],
            }),
        });

        // ✅ STEP 3 - Debug AI response
        const aiData = await response.json();

        console.log("=== AI RESPONSE ===");
        console.log("Status:", response.status);
        console.log("Full AI data:", JSON.stringify(aiData, null, 2));

        // ✅ STEP 4 - Check for errors in AI response
        if (aiData.error) {
            console.error("AI error:", aiData.error);
            return res.status(500).json({ 
                message: "AI service error: " + aiData.error.message 
            });
        }

        if (!aiData.choices || aiData.choices.length === 0) {
            console.error("No choices in AI response:", aiData);
            return res.status(500).json({ 
                message: "AI returned empty response" 
            });
        }

        const rawText = aiData.choices[0].message.content;
        console.log("=== RAW AI TEXT ===");
        console.log(rawText);

        // ✅ STEP 5 - Parse JSON
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return res.status(500).json({ message: "AI did not return valid JSON" });
        }

        const parsed = JSON.parse(jsonMatch[0]);

        return res.json({
            success: true,
            resumeData: parsed,
            resumeText: resumeText.slice(0, 3000)
        });

    } catch (err) {
        console.error("=== FULL ERROR ===");
        console.error(err);
        if (req.file?.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({ 
            message: "Failed to process resume: " + err.message 
        });
    }
});

export default router;