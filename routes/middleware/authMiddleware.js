<<<<<<< HEAD
const logger = require('../../utils/logger'); // Import the logger to use for logging errors and information
const sessionCache = require('../../utils/sessionCache'); // Import the sessionCache for session management

const isAuthenticated = (req, res, next) => {
  const sessionId = req.cookies['sessionId'];
  if (!sessionId) {
    logger.info('No session ID found in request cookies.');
    return res.status(401).send('You are not authenticated');
  }

  const sessionData = sessionCache.getSession(sessionId);
  if (!sessionData) {
    logger.info(`Session data not found for session ID: ${sessionId}`);
    return res.status(401).send('You are not authenticated');
  }

  logger.info(`Attempting to authenticate user with session ID: ${sessionId}`);
  logger.info(`Session details: `, sessionData);

  if (sessionData.userId) {
    logger.info(`User ${sessionData.userId} is authenticated, proceeding to next middleware`);
    req.session = sessionData; // Attach the session data to the request object for downstream use
    return next(); // User is authenticated, proceed to the next middleware/route handler
  } else {
    logger.info(`Authentication failed for session ID: ${sessionId}. No userId found in session.`);
    logger.error(`Error: User not authenticated. Session ID: ${sessionId}`);
    // Logging the full error details for better debugging using the logger
    logger.error(`Full error details: User not authenticated. Attempted access without valid session.`);
    logger.error(`Session object: `, sessionData); // Enhanced error logging with session object details using the logger
=======
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next(); // User is authenticated, proceed to the next middleware/route handler
  } else {
>>>>>>> heroku/master
    return res.status(401).send('You are not authenticated'); // User is not authenticated
  }
};

module.exports = {
  isAuthenticated
};