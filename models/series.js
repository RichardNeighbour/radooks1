const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const logger = require('../utils/logger'); // Import the logger

const episodeSchema = new Schema({
  episodeNumber: { type: Number, required: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
});

const commentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  comment: { type: String, required: true },
  datePosted: { type: Date, default: Date.now }
});

const seriesSchema = new Schema({
  title: { type: String, required: true, index: true },
  description: { type: String, required: true },
  episodes: [episodeSchema],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  comments: [commentSchema]
});

seriesSchema.index({ title: 'text', description: 'text' });

seriesSchema.pre('save', function(next) {
  logger.info(`Saving series: ${this.title}`);
  if (!this.createdBy || !mongoose.Types.ObjectId.isValid(this.createdBy.toString())) {
    logger.error('Error saving series: createdBy is not a valid ObjectId');
    next(new Error('createdBy must be a valid ObjectId'));
  } else {
    next();
  }
});

seriesSchema.post('save', function(error, doc, next) {
  if (error) {
    logger.error(`Error saving series: ${error}`);
    logger.error(error.stack);
    if (error.name === 'MongoError' && error.code === 11000) {
      logger.error(`Error saving series due to duplicate key: ${error}`);
      next(new Error('There was a duplicate key error'));
    } else {
      next(error); // Ensure the error gets logged with full trace
    }
  } else {
    logger.info(`Series saved: ${doc.title}`);
    next();
  }
});

seriesSchema.pre('validate', async function(next) {
  logger.info('Validating series document');
  if (!mongoose.Types.ObjectId.isValid(this.createdBy)) {
    logger.error(`Validation error: createdBy (${this.createdBy}) is not a valid ObjectId`);
    next(new Error('createdBy must be a valid ObjectId'));
  } else {
    next();
  }
});

const Series = mongoose.model('Series', seriesSchema);

module.exports = Series;