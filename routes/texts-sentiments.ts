import express from "express";
import { pipeline } from "@xenova/transformers";

const router = express.Router();

let sentimentAnalyzer: any;
let loadingPromise: Promise<void> | null = null;

const loadModel = async () => {
    if (!loadingPromise) {
        loadingPromise = (async () => {
            console.log("Loading sentiment model...");
            sentimentAnalyzer = await pipeline(
                "sentiment-analysis",
                // 'Xenova/distilbert-base-uncased-finetuned-sst-2-english'
                "Xenova/twitter-roberta-base-sentiment-latest"
                // 'Xenova/robertuito-sentiment-analysis'
            );
            console.log("Sentiment model loaded");
        })();
    }
    await loadingPromise;
};

router.post("/", async (req: any, res: any) => {
    try {
        const { texts } = req.body;

        if (!texts?.length) {
            return res.status(400).json({ error: "No texts provided" });
        }

        await loadModel();

        const sentiments = await Promise.all(
            texts.map((text: string) => sentimentAnalyzer(text))
        );

        const sentimentResults = sentiments.map(
            (sentiment: any) => sentiment[0]
        );

        console.log("Sentiment Results:", sentiments, sentimentResults);

        res.status(200).json({ sentiments: sentimentResults });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Sentiment analysis failed" });
    }
});

export default router;