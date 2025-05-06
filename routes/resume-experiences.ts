import express, { Request, Response } from 'express';
import { pipeline } from '@xenova/transformers';
import { resumeExperiencesPrompt } from '../prompts';

const router = express.Router();

let resumeExperiencesGenerator: any;
let loadingPromise: Promise<void> | null = null;

// Function to lazily load the pipeline once
const loadModel = async () => {
    if (!loadingPromise) {
        loadingPromise = (async () => {
            console.log("Loading sentiment model...");
            resumeExperiencesGenerator = await pipeline(
                'text2text-generation',
                'Xenova/LaMini-Flan-T5-783M'
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

        // only focuses on the candidate's skills
        //         const prompt = `
        //     from this resume text provide a detailed breakdown of the candidate's experiences or professional experiences. 

        //     Identify the specific experiences mentioned in this resume.

        //     list experiences from this resume in a way that can be easily understood by the interviewer.

        //     if no relevant experiences or professional experiences are found, try to list found experiences, certifications and educations or any other relevant information.

        // Resume text to analyze: ${text}`;

        const prompt = resumeExperiencesPrompt(text);

        const result = await resumeExperiencesGenerator(prompt, {
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