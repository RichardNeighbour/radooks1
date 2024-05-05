const express = require('express');
require('dotenv').config(); // Ensure environment variables are loaded
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Logging middleware to log all incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} request received at ${req.originalUrl} with body:`, req.body);
  next();
});

app.post('/generate', (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    console.error('No prompt provided');
    return res.status(400).send('No prompt provided');
  }
  try {
    // Placeholder function to simulate generating a storyline
    const storyline = {
      title: `Story generated from: ${prompt}`,
      plot: `This is a placeholder plot for the prompt: ${prompt}. More details will be added in the future.`,
      characters: ['Character 1', 'Character 2'],
    };
    console.log(`Storyline generated for prompt: ${prompt}`);
    res.json(storyline);
  } catch (error) {
    console.error(`Error generating storyline: ${error.message}`, error);
    res.status(500).send('Error generating storyline');
  }
});

// Note: This service is for story generation and listens on port 3001.
// It handles the expansion of user prompts into detailed storylines.
// For converting storylines into animated videos, use the AnimationAutomation service on port 3002.

app.listen(PORT, () => console.log(`AIStoryGenerator service running on port ${PORT}`));