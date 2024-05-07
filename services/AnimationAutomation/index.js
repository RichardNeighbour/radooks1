const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const Joi = require('joi');

require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} request received at ${req.originalUrl}`);
  console.log('Request body:', req.body);
  next();
});

// Serve static files from the output directory
app.use('/output', express.static(path.join(__dirname, 'output')));

const requestSchema = Joi.object({
  storyline: Joi.object({
    title: Joi.string().required(),
    plot: Joi.string().required(),
    characters: Joi.array().items(Joi.string()).required()
  }).required()
});

app.post('/create-animation', (req, res) => {
  const { error, value } = requestSchema.validate(req.body);
  if (error) {
    console.error('Validation error:', error.details);
    return res.status(400).send('Storyline validation failed: ' + error.details.map(detail => detail.message).join(', '));
  }

  const { storyline } = value;

  console.log(`Received request to create animation for validated storyline: ${JSON.stringify(storyline)}`);

  const videoPath = path.join(__dirname, 'output', 'animation.mp4');
  if (!fs.existsSync(path.join(__dirname, 'output'))) {
    try {
      fs.mkdirSync(path.join(__dirname, 'output'), { recursive: true });
    } catch (err) {
      console.error('Failed to create output directory:', err.message, err);
      return res.status(500).send('Failed to create output directory');
    }
  }

  ffmpeg(path.join(__dirname, 'placeholder.png'))
    .loop(5)
    .fps(25)
    .size('640x360')
    .on('end', () => {
      console.log('Video file is created.');
      const videoURL = `http://localhost:${PORT}/output/animation.mp4`; // Assuming local hosting for demonstration purposes
      console.log(`Video creation successful, videoURL: ${videoURL}`);
      res.json({ message: 'Video creation successful', videoURL: videoURL });
    })
    .on('error', (err) => {
      console.error('Failed to create animation:', err.message, err);
      res.status(500).send('Failed to create animation');
    })
    .save(videoPath);
});

app.listen(PORT, () => {
  console.log(`AnimationAutomation service running on port ${PORT}`);
});