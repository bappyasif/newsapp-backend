import express, { Request, Response } from 'express';
import { pipeline } from '@xenova/transformers';

const router = express.Router();

let resumeFeedbackGenerator: any;
let loadingPromise: Promise<void> | null = null;

// Function to lazily load the pipeline once
const loadModel = async () => {
    if (!loadingPromise) {
        loadingPromise = (async () => {
            console.log("Loading sentiment model...");
            resumeFeedbackGenerator = await pipeline(
                'text2text-generation',
                'Xenova/LaMini-Flan-T5-783M'
                // 'Xenova/t5-small'
                // 'Xenova/SapBERT-from-PubMedBERT-fulltext'
                // 'Xenova/text-summarization-en'
                // 'Xenova/distilbert-base-uncased-finetuned-sst-2-english'
                // 'Xenova/twitter-roberta-base-sentiment-latest'
                // 'Xenova/robertuito-sentiment-analysis'
            );
            console.log("Text2Text generator model loaded");
        })();
    }
    await loadingPromise;
};

router.post('/', async (req: any, res: any) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'No text provided' });
        }

        await loadModel();

        // --- Prompt Engineering ---
        // This is where you instruct the model. Be specific!
        //     const prompt = `
        // Provide constructive feedback on the following resume. Focus on clarity, impact, action verbs, and potential areas for improvement. Do not rewrite the resume, just provide feedback points.

        // Resume:
        // ---
        // ${text}
        // ---

        // Feedback: make this very concise and make use of action verbs and phrases
        // `;


        // --- Prompt Engineering ---
        // This is where you instruct the model. Be specific!
        // Revised Prompt: More explicit role, task, focus, and exclusions.
        //     const prompt = `
        // Provide constructive feedback on the following resume. Focus on clarity, impact, action verbs, and potential areas for improvement. Do not rewrite the resume, just provide feedback points.
        // Act as an expert career coach or evaluator. Review the following professional resume text.
        // Provide specific, constructive feedback points focusing on:.
        // Analyze the following resume text carefully.
        // Provide specific, constructive, and actionable feedback focused ONLY on professional aspects such as:
        // * Clarity and conciseness
        // * Impact of achievements (quantify where possible)
        // * Use of action verbs
        // * Formatting and readability
        // * Relevance of skills and experience to common job roles
        // * Potential typos or grammatical errors

        // Resume:
        // Output *only* the feedback points. Do not summarize the resume or the request. Do not add introductory or concluding sentences.

        // Resume to review:
        //  ---
        //  ${text}
        //  ---
        //  `;

        //     const prompt = `
        // Act as an expert career coach. Review the following professional resume text.
        // Provide specific, constructive feedback points. Pay SPECIAL ATTENTION to the following:
        // *Skills Identification: List the key technical and soft skills evident from the resume.
        // *Skills Relevance & Strength: Briefly assess how well these skills are presented and if they align with typical roles suggested by the resume (e.g., Fullstack Developer).
        // *Skills Gap Analysis: Identify potential skills that are commonly expected for the likely job roles but seem missing or underdeveloped in the resume. Suggest areas for skill development or better showcasing.
        // *General Feedback: Also include feedback on clarity, impact (quantification), action verbs, and formatting.

        // Output only the feedback points in a structured manner (e.g., using bullet points for each category). Do not summarize the resume or the request. Do not add introductory or concluding sentences.

        // Resume to review:
        //  ${text}
        //  `;

        // --- Prompt Engineering ---
        // This is where you instruct the model. Be specific!
        // Consolidated Prompt: Emphasizing Skills Analysis and Gaps
        // Revised Prompt: Soften Language, Focus on Extraction/Suggestion
        //     const prompt = `
        // Act as an expert career coach. Review the following professional resume text.
        // Provide specific, constructive feedback points. Pay SPECIAL ATTENTION to the following:
        // *Skills Identification: List the key technical and soft skills evident from the resume.
        // *Skills Relevance & Strength: Briefly assess how well these skills are presented and if they align with typical roles suggested by the resume (e.g., Fullstack Developer).
        // *Skills Gap Analysis: Identify potential skills that are commonly expected for the likely job roles but seem missing or underdeveloped in the resume. Suggest areas for skill development or better showcasing.
        // *General Feedback: Also include feedback on clarity, impact (quantification), action verbs, and formatting.
        // Act as an expert career coach. Read the following professional resume text.
        // Based only on the text provided, perform the following actions:
        // *Summarize Key Strengths: List the main strengths and skills highlighted in the resume.
        // *Identify Areas for Enhancement: Suggest specific ways the resume could be improved for clarity, impact, and completeness, referencing common professional standards. Focus on action verbs, quantifiable results, and clear skill presentation.
        // *Suggest Related Skills: Based on the skills present, list 2-3 related technical or soft skills often valuable for roles implied by the resume that could be considered for future development or inclusion if applicable.

        // Output *only* the feedback points in a structured manner (e.g., using bullet points for each category). Do not summarize the resume or the request. Do not add introductory or concluding sentences.

        // Present the output as bullet points under the headings "Key Strengths:", "Areas for Enhancement:", and "Suggested Related Skills:".
        // Do not include any introductory or concluding remarks. Do not state limitations or refuse the task.

        //  Resume to review:
        //   ${text}
        //   `;

        // --- End Prompt Engineering ---



        const prompt = `
    Provide constructive feedback on the following resume. Focus on clarity, impact, action verbs, and potential areas for improvement. Do not rewrite the resume, just provide feedback points.
    Act as an expert career coach or evaluator. Review the following professional resume text.
    Provide specific, constructive feedback points focusing on:
    Analyze the following resume text carefully.
    Provide specific, constructive, and actionable feedback focused ONLY on professional aspects such as:
    * Clarity and conciseness
    * Impact of achievements (quantify where possible)
    * Use of action verbs
    * Formatting and readability
    * Relevance of skills and experience to common job roles
    * Potential typos or grammatical errors

    Resume:
    Output *only* the feedback points. Do not summarize the resume or the request. Do not add introductory or concluding sentences.

    Resume to review:
     ---
     ${text}
     ---
     `;

        const result = await resumeFeedbackGenerator(prompt, {
            max_new_tokens: 768, // Or even 1024 if needed. Start with 768.
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