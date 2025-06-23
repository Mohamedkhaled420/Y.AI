import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Example AI/chat endpoint
app.post('/api/gemini', async (req, res) => {
  // TODO: Integrate your AI/chat logic here
  res.json({ reply: "Hello from DigitalOcean API!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
