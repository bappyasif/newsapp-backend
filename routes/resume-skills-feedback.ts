import express, { Request, Response } from 'express';
import { pipeline } from '@xenova/transformers';
import { resumeSkillsFeedbackPrompt } from '../prompts';

const router = express.Router();

let resumeSkillsFeedbackGenerator: any;
let loadingPromise: Promise<void> | null = null;

// Function to lazily load the pipeline once
const loadModel = async () => {
    if (!loadingPromise) {
        loadingPromise = (async () => {
            console.log("Loading sentiment model...");
            resumeSkillsFeedbackGenerator = await pipeline(
                'text2text-generation',
                'Xenova/LaMini-Flan-T5-783M'
                // 'Xenova/t5-small'
            );
            console.log("Text2Text generator model loaded");
        })();
    }
    await loadingPromise;
};

router.post('/', async (req: any, res: any) => {
    try {
        const { text, role } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'No text provided' });
        }

        await loadModel();

        //         const prompt = `
        //     Analyze the extracted resume text and provide a detailed breakdown of the candidate's technical skills and work experience. Identify the specific skills mentioned, including:

        // Programming languages
        // Development frameworks and libraries
        // Databases and data management systems
        // Operating Systems
        // Cloud platforms
        // Agile methodologies
        // Other relevant technical skills
        // Also, assess the candidate's work experience and identify:

        // Job titles and industries
        // Key achievements and accomplishments
        // Relevant tools and technologies used in previous roles
        // Compare the candidate's skills and experience to common job roles in the industry as:${role}

        // Provide a list of skills that are commonly found in ${role} roles, and highlight any gaps or areas where the candidate's skills may not align.

        // Additionally, provide a summary of the candidate's technical strengths and weaknesses, and suggest potential areas for improvement.

        // Provide a list of skills that are commonly found in these roles, and highlight any gaps or areas where the candidate's skills may not align.

        // Please provide a response of at least 400-450 words to ensure that all relevant information is included.


        // Resume text to analyze: ${text}`;

        //         const prompt = `
        //     Analyze the extracted resume text and provide a detailed breakdown of the candidate's skills. Identify the specific skills mentioned and highlight any gaps or areas where the candidate's skills may not align

        // Relevant tools and technologies used in previous roles
        // Compare the candidate's skills as a ${role} and experience to common job roles in the industry as a ${role}

        // Additionally, provide a summary of the candidate's technical strengths and weaknesses, and suggest potential areas for improvement.

        // Please provide a response of at least 400-450 words to ensure that all relevant information is included.


        // Resume text to analyze: ${text}`;

        // only focuses on the candidate's skills
        // const prompt = `
        //     Analyze the extracted resume text and provide a detailed breakdown of the candidate's skills. Identify the specific skills mentioned

        // Relevant tools and technologies used in previous roles
        // Compare and list the candidate's skills as a ${role} to common job roles in the industry as a ${role}

        // Resume text to analyze: ${text}`;


        const prompt = resumeSkillsFeedbackPrompt(text, role,);

        const result = await resumeSkillsFeedbackGenerator(prompt, {
            max_new_tokens: 2048, // Or even 1024 if needed. Start with 768.
            // --- Keep or adjust other parameters as needed ---
            num_beams: 2,
            early_stopping: false, // Consider setting to false if you want the full length always
        });

        // const result = await resumeFeedbackGenerator(text, {
        //   max_new_tokens: 400,
        //   // feedback: true
        // });
        const generatedText = result[0].generated_text;
        console.log(result, "result", generatedText);
        // res.json(result);
        res.status(200).json({ generatedText });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Text2Text generation failed' });
    }
});

export default router;