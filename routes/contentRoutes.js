const express = require('express');
const axios = require('axios');
const youtubeUploader = require('../utils/youtubeUploader');
const router = express.Router();

router.get('/submit-prompt', (req, res) => {
    res.render('submitPrompt');
});

router.post('/submit-prompt', async (req, res) => {
    const { prompt } = req.body;
    try {
        console.log('Submitting prompt to AIStoryGenerator service');
        // Call AIStoryGenerator service
        const storyResponse = await axios.post(`${process.env.AISTORY_GENERATOR_URL}/generate`, { prompt }); 
        if (storyResponse.status !== 200) {
            console.error('Failed to generate story from AIStoryGenerator service', storyResponse.data);
            throw new Error('Failed to generate story from AIStoryGenerator service');
        }
        const story = storyResponse.data;

        console.log('Received story from AIStoryGenerator, submitting to AnimationAutomation service');
        // Call AnimationAutomation service
        const animationResponse = await axios.post(`${process.env.ANIMATION_AUTOMATION_URL}/create-animation`, { storyline: story }); // INPUT_REQUIRED {Set the AnimationAutomation service URL in the .env file}
        if (animationResponse.status !== 200) {
            console.error('Failed to create animation from AnimationAutomation service', animationResponse.data);
            throw new Error('Failed to create animation from AnimationAutomation service');
        }
        const animationURL = animationResponse.data.videoURL;

        console.log('Received animation URL, uploading to YouTube');
        // Upload to YouTube
        const youtubeURL = await youtubeUploader(animationURL, story.title, story.plot);

        console.log(`Upload successful, YouTube URL: ${youtubeURL}`);
        // Display success message with YouTube link
        res.render('submissionSuccess', { youtubeURL });
    } catch (error) {
        console.error('Error in processing the submission:', error.message, error.stack);
        res.status(500).send('There was an error with your submission.');
    }
});

module.exports = router;