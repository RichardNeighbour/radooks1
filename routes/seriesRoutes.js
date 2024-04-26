import express from 'express';
import mongoose from 'mongoose';
import { Series } from '../models/series.js';
import { User } from '../models/User.js'; // Added to validate userId
import { isAuthenticated } from './middleware/authMiddleware.js';
import { logger } from '../utils/logger.js'; // Import the logger to use for logging
import { generateStoryline } from '../services/aiIntegrationService.js'; // Import AI Integration service for storyline generation and animation scripting

const router = express.Router();

// Route for creating a new animated series
router.post('/api/series', isAuthenticated, async (req, res) => {
  logger.info(`Attempting to create a new series with title: ${req.body.title}`);
  try {
    const { title, episodes } = req.body;
    if (!title || !episodes || episodes.length === 0) {
      logger.error('Validation failed: Missing information for title or episodes.');
      return res.status(400).json({ message: 'Missing information for title or episodes.' });
    }

    // Using AI to generate a storyline based on the title
    const generatedDescription = await generateStoryline(`Create a compelling storyline for a series titled: ${title}`).catch(error => {
      logger.error('Error generating description with AI:', error);
      throw new Error('Failed to generate description with AI');
    });

    const series = new Series({
      title,
      description: generatedDescription, // Using the AI-generated description
      episodes,
      createdBy: req.session.userId
    });

    const savedSeries = await series.save();
    logger.info(`New series created: ${savedSeries.title} with AI-generated description.`);
    res.status(201).json(savedSeries);
  } catch (error) {
    logger.error('Error creating new series:', error);
    logger.error(error.stack);
    res.status(500).json({ message: 'Internal server error while creating new series.' });
  }
});

// Route to fetch all series
router.get('/api/series', async (req, res) => {
  logger.info('Fetching all series');
  try {
    const allSeries = await Series.find({});
    logger.info(`Found ${allSeries.length} series`);
    res.status(200).json(allSeries);
  } catch (error) {
    logger.error('Error fetching series:', error);
    logger.error(error.stack);
    res.status(500).json({ message: 'Internal server error while fetching series.' });
  }
});

// Route to fetch a specific series by ID
router.get('/series/:id', async (req, res) => {
  logger.info(`Fetching series with ID: ${req.params.id}`);
  try {
    const series = await Series.findById(req.params.id);
    if (!series) {
      logger.error(`Series with ID: ${req.params.id} not found.`);
      return res.status(404).send('Series not found.');
    }
    logger.info(`Found series: ${series.title}`);
    res.render('seriesDetails', { serie: series, session: req.session });
  } catch (error) {
    logger.error('Error fetching series by ID:', error);
    logger.error(error.stack);
    res.status(500).send('Internal server error while fetching series details.');
  }
});

// New route to fetch a specific episode by series ID and episode number
router.get('/series/:seriesId/episodes/:episodeNumber', async (req, res) => {
  logger.info(`Fetching episode number: ${req.params.episodeNumber} for series ID: ${req.params.seriesId}`);
  try {
    const series = await Series.findById(req.params.seriesId);
    if (!series) {
      logger.error(`Series with ID: ${req.params.seriesId} not found.`);
      return res.status(404).send('Series not found.');
    }
    const episode = series.episodes.find(ep => ep.episodeNumber === parseInt(req.params.episodeNumber));
    if (!episode) {
      logger.error(`Episode number: ${req.params.episodeNumber} not found in series: ${series.title}`);
      return res.status(404).send('Episode not found.');
    }
    logger.info(`Found episode: ${episode.title} in series: ${series.title}`);
    res.render('episodeDetails', { episode: episode, serie: series, session: req.session });
  } catch (error) {
    logger.error('Error fetching episode by number:', error);
    logger.error(error.stack);
    res.status(500).send('Internal server error while fetching episode details.');
  }
});

// Route for submitting a comment on a series
router.post('/api/series/:id/comment', isAuthenticated, async (req, res) => {
  logger.info(`Attempting to submit a comment for series ID: ${req.params.id}`);
  const { comment } = req.body;
  if (!comment) {
    logger.error('Validation failed: Comment cannot be empty.');
    return res.status(400).json({ message: 'Comment cannot be empty.' });
  }

  try {
    const series = await Series.findById(req.params.id);
    if (!series) {
      logger.error(`Series not found with ID: ${req.params.id}`);
      return res.status(404).json({ message: 'Series not found.' });
    }

    // Ensure the user exists before adding a comment
    const userExists = await User.exists({ _id: req.session.userId });
    if (!userExists) {
      logger.error(`Validation failed: User with ID: ${req.session.userId} does not exist.`);
      return res.status(404).json({ message: 'User not found or ID is invalid.' });
    }

    logger.info("Adding comment to series:", comment);
    const updatedSeries = await Series.findByIdAndUpdate(req.params.id, {
      $push: { comments: { userId: req.session.userId, comment: comment, datePosted: new Date() } }
    }, { new: true });

    logger.info(`Comment added to series: ${updatedSeries.title}`);
    res.status(201).json({ message: 'Comment added successfully.' });
  } catch (error) {
    logger.error('Error submitting comment:', error);
    logger.error(error.stack);
    res.status(500).json({ message: 'Internal server error while submitting comment. Please try again later.' });
  }
});

// Route to serve the series creation form
router.get('/series/create', isAuthenticated, (req, res) => {
  try {
    res.render('createSeries', { session: req.session }); // Ensure 'createSeries' view exists
  } catch (error) {
    logger.error("Failed to render the series creation page:", error);
    logger.error(error.stack);
    res.status(500).send("Internal Server Error");
  }
});

export default router;