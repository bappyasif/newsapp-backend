import dotenv from 'dotenv';
import path from 'path'; // Import path for robustly locating .env.local

// --- Load environment variables ---
// Call dotenv.config() as early as possible.
// If you are using a .env.local file, specify its path.
// This ensures that process.env is populated before other modules are loaded.
const envPath = path.resolve(process.cwd(), '.env.local'); // Assumes .env.local is in your project root
const dotenvResult = dotenv.config({ path: envPath });

if (dotenvResult.error) {
  // If .env.local is optional, this can be a warning.
  // If it's critical, you might want to throw an error or log a more severe message.
  console.warn(`Warning: Could not load .env.local file from ${envPath}. Error: ${dotenvResult.error.message}`);
  console.log("Attempting to load default .env file instead or relying on system environment variables.");
  dotenv.config(); // Attempt to load default .env if .env.local fails or is not found
}

import express from 'express';
// import 'dotenv/config';
import cors from 'cors';
import sentimentRoute from '../routes/sentiment';
import textsSentimentsRoute from '../routes/texts-sentiments';
import text2textGenartionRoute from '../routes/text2text-generation';
import resumeFeedbackRoute from '../routes/resume-feedback';
import resumeSkillsFeedbackRoute from '../routes/resume-skills-feedback';
import resumeSkillsRoute from '../routes/resume-skills';
import resumeExperiencesRoute from '../routes/resume-experiences';
import resumeGeminiRoute from '../routes/resume-gemini';

const app = express();
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'] // Allow requests from your frontend
}));

app.use(express.json());

app.use('/sentiment', sentimentRoute);
app.use('/texts-sentiments', textsSentimentsRoute);
app.use('/text2text-generation', text2textGenartionRoute);
app.use('/resume-feedback', resumeFeedbackRoute);
app.use('/resume-skills-feedback', resumeSkillsFeedbackRoute);
app.use('/resume-skills', resumeSkillsRoute);
app.use('/resume-experiences', resumeExperiencesRoute);
app.use('/resume-gemini', resumeGeminiRoute);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(process.env.PORT || 3001, () => {
  console.log('newsapp-backend server is running...');
});
