import express from "express";
import puppeteer from "puppeteer"; // or puppeteer-core + @sparticuz/chromium
// import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
 
const router = express.Router();

router.post("/test", async (req: any, res: any) => {
    console.log("Scraper route hit with body:", req.body);
    return res.status(200).json({ message: "Scraper route hit" });
});


router.post("/", async (req: any, res: any) => {
    const { url } = req.body;

    if (!url) return res.status(400).json({ error: "URL is required" });

    try {
        // const browser = await puppeteer.launch({ headless: true });
        const browser = await puppeteer.launch({
            args: chromium.args,
            executablePath: await chromium.executablePath(),
            headless: true, // ✅ Always use true on Vercel/serverless
            //   defaultViewport: chromium.defaultViewport,
        });
        console.log("Launching browser...");

        // const browser = await puppeteer.launch({
        //     headless: true, // will open a real Chrome window
        //     defaultViewport: null,
        // });

        const page = await browser.newPage();
        
        await page.goto(url, { waitUntil: "domcontentloaded" });

        console.log("Page loaded:", url);

        // Wait for the page to fully load
        // Try to wait for article
        // await page.waitForSelector("article", { timeout: 30000 });

        const text2 = await page.$$eval("section[name='articleBody'] .StoryBodyCompanionColumn", els =>
            els.map(el => el.textContent || el?.innerHTML).join(" ")
        );

        let cleanedText = text2.replace(/\s+/g, " ").trim();

        const tringToBeRemoved = "SKIP TO CONTENT SKIP TO SITE INDEX SEARCH & SECTION NAVIGATION"

        cleanedText = cleanedText.replace(tringToBeRemoved, "").trim();

        console.log("Extracted text length:", cleanedText.length);

        await browser.close();

        if (!cleanedText) {
            return res.status(404).json({ error: "No article content found" });
        }

        return res.status(200).json({
            preview: cleanedText.slice(0, 300) + "...",
            cleanedText,
            sourceUrl: url,
        });

    } catch (err) {
        console.error("Scrape error:", err);
        res.status(500).json({ error: "Scraping failed", err});
    }
});

export default router;

// router.post("/", async (req: any, res: any) => {
//     const { url } = req.body;

//     if (!url) return res.status(400).json({ error: "URL is required" });

//     try {
//         // const browser = await puppeteer.launch({ headless: true });
//         // const browser = await puppeteer.launch({
//         //     args: chromium.args,
//         //     executablePath: await chromium.executablePath(),
//         //     headless: true, // ✅ Always use true on Vercel/serverless
//         //     //   defaultViewport: chromium.defaultViewport,
//         // });
//         const browser = await puppeteer.launch({
//             headless: false, // will open a real Chrome window
//             defaultViewport: null,
//         });

//         const page = await browser.newPage();
//         await page.goto(url, { waitUntil: "domcontentloaded" });

//         console.log("Page loaded:", url);

//         // Wait for the page to fully load
//         // Try to wait for article
//         // await page.waitForSelector("article", { timeout: 30000 });

//         const text2 = await page.$$eval("article p", els =>
//             els.map(el => el.innerText).join(" ")
//         );

//         const cleanedText = text2.replace(/\s+/g, " ").trim();

//         return res.status(200).json({
//             preview: cleanedText.slice(0, 300) + "...",
//             cleanedText,
//             sourceUrl: url,
//         });

//         // Try extracting NYT article body
//         const text = await page.evaluate(() => {
//             const article = document.querySelector("section[name='articleBody'] .meteredContent");

//             // const article = articleHandle;

//             if (article) {
//                 console.log("Article found using <article> tag.", article);
//             }
//             // return article ? article?.innerHTML : "";
//             return article ? article : "";
//         });

//         await browser.close();

//         if (!text) {
//             return res.status(404).json({ error: "No article content found" });
//         }

//         return res.status(200).json({ sourceUrl: url, content: text });
//     } catch (err) {
//         console.error("Scrape error:", err);
//         res.status(500).json({ error: "Scraping failed" });
//     }
// });

// export default router;
