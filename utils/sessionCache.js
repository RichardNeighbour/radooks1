const cache = require('memory-cache');
const logger = require('../utils/logger');

class SessionCache {
  constructor() {
    this.cache = new cache.Cache();
  }

  // Save session data
  saveSession(sessionId, data, ttl) {
    try {
      this.cache.put(sessionId, data, ttl, (key) => {
        logger.info(`Session with id ${key} expired`);
      });
      logger.info(`Session with id ${sessionId} saved successfully`);
    } catch (error) {
      logger.error(`Error saving session with id ${sessionId}: ${error.message}`);
      logger.error(error.stack);
    }
  }

  // Retrieve session data
  getSession(sessionId) {
    try {
      const data = this.cache.get(sessionId);
      if (data) {
        logger.info(`Session with id ${sessionId} retrieved successfully`);
        return data;
      } else {
        logger.info(`Session with id ${sessionId} not found`);
        return null;
      }
    } catch (error) {
      logger.error(`Error retrieving session with id ${sessionId}: ${error.message}`);
      logger.error(error.stack);
      return null;
    }
  }

  // Delete session data
  deleteSession(sessionId) {
    try {
      this.cache.del(sessionId);
      logger.info(`Session with id ${sessionId} deleted successfully`);
    } catch (error) {
      logger.error(`Error deleting session with id ${sessionId}: ${error.message}`);
      logger.error(error.stack);
    }
  }
}

module.exports = new SessionCache();