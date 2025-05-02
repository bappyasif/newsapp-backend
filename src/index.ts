import express from 'express';
import sentimentRoute from '../routes/sentiment';
import textsSentimentsRoute from '../routes/texts-sentiments';

const app = express();
app.use(express.json());

app.use('/sentiment', sentimentRoute);
app.use('/texts-sentiments', textsSentimentsRoute);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(process.env.PORT || 3001, () => {
  console.log('newsapp-backend server is running...');
});
