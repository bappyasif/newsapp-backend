import express from 'express';
import sentimentRoute from '../routes/sentiment';
import textsSentimentsRoute from '../routes/texts-sentiments';
import text2textGenartionRoute from '../routes/text2text-generation';
import resumeFeedbackRoute from '../routes/resume-feedback';
import resumeSkillsFeedbackRoute from '../routes/resume-skills-feedback';
import resumeSkillsRoute from '../routes/resume-skills';
import resumeExperiencesRoute from '../routes/resume-experiences';

const app = express();
app.use(express.json());

app.use('/sentiment', sentimentRoute);
app.use('/texts-sentiments', textsSentimentsRoute);
app.use('/text2text-generation', text2textGenartionRoute);
app.use('/resume-feedback', resumeFeedbackRoute);
app.use('/resume-skills-feedback', resumeSkillsFeedbackRoute);
app.use('/resume-skills', resumeSkillsRoute);
app.use('/resume-experiences', resumeExperiencesRoute);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(process.env.PORT || 3001, () => {
  console.log('newsapp-backend server is running...');
});
