import express from 'express';
import { pipeline } from '@xenova/transformers';

const router = express.Router();

let sentimentAnalyzer: any;
let loadingPromise: Promise<void> | null = null;

// Function to lazily load the pipeline once
const loadModel = async () => {
  if (!loadingPromise) {
    loadingPromise = (async () => {
      console.log("Loading sentiment model...");
      sentimentAnalyzer = await pipeline(
        'sentiment-analysis',
        // 'Xenova/distilbert-base-uncased-finetuned-sst-2-english'
        'Xenova/twitter-roberta-base-sentiment-latest'
        // 'Xenova/robertuito-sentiment-analysis'
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
    console.log("Sentiment Result:", result); // Log the result
    res.status(200).json(result);
  } catch (error) {
    console.error('Sentiment analysis failed:', error);
    res.status(500).json({ error: 'Sentiment analysis failed' });
  }
});

export default router;

// import express from 'express';
// import { pipeline } from '@xenova/transformers';

// const router = express.Router();

// let sentimentAnalyzer: any;

// let sentimentModel: any;

// const loadModel = async () => {
//   if (!sentimentModel) {
//     sentimentModel = await pipeline('sentiment-analysis', 'xenova/bert-base-uncased');
//   }
//   return sentimentModel;
// };

// router.post('/', async (req: any, res: any) => {
//   const { text } = req.body;

//   console.log("Request Body:", req.body); // Log the request data

//   if (!text) {
//     return res.status(400).json({ error: 'Text is required' });
//   }

//   try {
//     if (!sentimentAnalyzer) {
//       // sentimentAnalyzer = await pipeline('sentiment-analysis');
//       // sentimentModel = await loadModel();

//       // sentimentAnalyzer = await pipeline('sentiment-analysis', 'xenova/bert-base-uncased');
//       const sentimentAnalyzer = await pipeline('sentiment-analysis', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');

//     }

//     const result = await sentimentAnalyzer(text);
//     // res.json(result);

//     // const result = await sentimentModel(text);
//     console.log("Sentiment Result:", result); // Log the result
//     res.status(200).json({ sentiment: result });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Sentiment analysis failed' });
//   }
// });

// export default router;