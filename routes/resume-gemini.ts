// server.js or routes/resume.js
import express, { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_FLASH2_0_LITE_API_KEY!);
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_FLASH2_0_API_KEY!);
// const genAI = new GoogleGenerativeAI("AIza.............................");

// const model = genAI.getGenerativeModel({ 
//     // model: 'gemini-flash2.0-lite' 
//     model: 'gemini-2.0-flash-lite'
//     // model: "gemini-2.0-flash",
// });

const apiKey = process.env.GEMINI_FLASH2_0_LITE_API_KEY;

if (!apiKey) {
  console.error("CRITICAL: GEMINI_FLASH2_0_API_KEY is not set. Ensure .env.local is loaded in index.ts.");
  // You might want to prevent the route from being set up or throw an error
  // that stops the server if the API key is essential for this module.
}

// Initialize genAI only if apiKey is available
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const model = genAI ? genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' }) : null;

router.post('/', async (req: any, res: any) => {
  try {
    const { text, role } = req.body;

    if(!role) return res.status(400).json({ error: "No role provided." });

    if (!text) return res.status(400).json({ error: "No resume text provided." });

    const prompt = `
    Analyze this resume and extract:
    - Name
    - Email
    - Phone
    - Skills
    - Experience
    - Education
    - Certifications

    when possible include improvements for role ${role} in skills required, experience, and education or certifications for resume feedback.

    Format your response as a JSON object.
    Resume Text:
    ${text}
    `;

    const result = await model?.generateContent(prompt);
    const responseText = result?.response.text();

    if (!result || !responseText) {
      console.error("No response or text from Gemini model.");
      return res.status(500).json({ error: "Failed to get a response from Gemini model." });
    }

    // Clean the responseText to remove potential markdown code block fences
    let cleanedJsonString = responseText;
    const jsonBlockMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);

    if (jsonBlockMatch && jsonBlockMatch[1]) {
      cleanedJsonString = jsonBlockMatch[1];
    } else {
      // If no markdown block is found, try to trim whitespace as a fallback
      cleanedJsonString = responseText.trim();
    }

    const parsedOutput = JSON.parse(cleanedJsonString);

    res.json({ output: parsedOutput });

    // res.json({ output: responseText, parsed: parsedOutput });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gemini API error" });
  }
});

export default router;