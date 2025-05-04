import express, { Request, Response } from 'express';
import { pipeline } from '@xenova/transformers';

const router = express.Router();

let text2textGenrator: any;
let loadingPromise: Promise<void> | null = null;

// Function to lazily load the pipeline once
const loadModel = async () => {
  if (!loadingPromise) {
    loadingPromise = (async () => {
      console.log("Loading sentiment model...");
      text2textGenrator = await pipeline(
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

    const result = await text2textGenrator(text, {
      max_new_tokens: 400,
      // feedback: true
    });
    
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