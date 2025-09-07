import express from 'express';
import { pipeline } from '@xenova/transformers';

const router = express.Router();

let sentimentAnalyzer: any;
let loadingPromise: Promise<void> | null = null;

// Function to lazily load the pipeline once
const loadModel = async () => {
  if (!loadingPromise) {
    loadingPromise = (async () => {
      sentimentAnalyzer = await pipeline(
        'sentiment-analysis',
        'Xenova/twitter-roberta-base-sentiment-latest'
      );
      console.log("Sentiment model loaded");
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

    const result = await sentimentAnalyzer(text);

    res.status(200).json(result);
  } catch (error) {
    console.error('Sentiment analysis failed:', error);
    res.status(500).json({ error: 'Sentiment analysis failed' });
  }
});

export default router;