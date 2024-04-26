// Load environment variables
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cookieParser = require('cookie-parser');
const cors = require('cors'); // Added for CORS support
const session = require('express-session'); // Added for session support
const authRoutes = require("./routes/authRoutes");
const seriesRoutes = require('./routes/seriesRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Import admin routes
const logger = require('./utils/logger'); // Import the logger
const loggingMiddleware = require('./middleware/loggingMiddleware'); // Import logging middleware
const fs = require('fs');
const path = require('path');

logger.info("Starting server...");

// Log critical environment variables for debugging purposes, masking sensitive information
logger.info(`Environment Variables - DATABASE_URL: ${process.env.DATABASE_URL}, SESSION_SECRET: [PROTECTED], CORS_ORIGIN: ${process.env.CORS_ORIGIN}, OPENAI_API_KEY: [PROTECTED]`);

if (!process.env.DATABASE_URL || !process.env.SESSION_SECRET || !process.env.CORS_ORIGIN) {
  logger.error("Error: config environment variables not set. Please create/edit .env configuration file.");
  process.exit(-1);
}

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Adding cookie-parser middleware
app.use(cookieParser());

// Setting the templating engine to EJS
app.set("view engine", "ejs");

// Serve static files
app.use(express.static("public"));

// Ensure logs directory exists
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Ensure documentation directory and files exist
const documentationDir = path.join(__dirname, 'documentation');
if (!fs.existsSync(documentationDir)) {
  fs.mkdirSync(documentationDir);
}
const issueTrackerPath = path.join(documentationDir, 'issueTracker.md');
const codeReviewProcessPath = path.join(documentationDir, 'codeReviewProcess.md');
if (!fs.existsSync(issueTrackerPath)) {
  fs.writeFileSync(issueTrackerPath, '# Issue Tracker\n');
}
if (!fs.existsSync(codeReviewProcessPath)) {
  fs.writeFileSync(codeReviewProcessPath, '# Code Review and Refactoring Process\n');
}

(async () => {
  try {
    logger.info("Initializing database connection...");
    await mongoose.connect(process.env.DATABASE_URL); // Removed deprecated options
    logger.info("Database connected successfully");
  } catch (err) {
    logger.error(`Database connection error: ${err.message}`);
    logger.error(err.stack);
    process.exit(1);
  }
})();

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === "production", httpOnly: true } // Ensure cookies are secure in production and HTTP only
}));

// CORS configuration to support credentials from different origins
const corsOptions = {
  origin: process.env.CORS_ORIGIN, // Ensure CORS origin is configurable through environment variables
  credentials: true,
  allowedHeaders: ['Content-Type', 'Accept'] // Explicitly allowing headers necessary for session management and AJAX requests
};
app.use(cors(corsOptions));

// Use logging middleware for logging each request
app.use(loggingMiddleware);

// Authentication Routes
app.use(authRoutes);

// Series Routes - Added line to use series routes
app.use(seriesRoutes);

// Admin Routes - Use admin routes
app.use('/admin', adminRoutes);

// Root path response
app.get("/", (req, res) => {
  res.render("index", { session: req.session });
});

// Adding route handler for /seriesList
app.get("/seriesList", async (req, res) => {
  // Fetching series data from the database
  const Series = require('./models/series'); // Ensure the Series model is correctly required
  try {
    const series = await Series.find({});
    logger.info(`Found ${series.length} series`);
    if (series.length === 0) {
      logger.info("No series available to display.");
    }
    // Rendering seriesList view with series data
    res.render("seriesList", { series: series, session: req.session });
  } catch (err) {
    logger.error('Error fetching series:', err);
    logger.error(err.stack);
    res.status(500).send("Error fetching series.");
  }
});

// If no routes handled the request, it's a 404
app.use((req, res, next) => {
  const notFoundUrl = req.originalUrl; // Capture the URL that was not found
  res.status(404).send("Page not found.");
  logger.error(`404 - Page not found at ${notFoundUrl}`); // Log the 404 error with the URL
});

// Error handling
app.use((err, req, res, next) => {
  logger.error(`Unhandled application error: ${err.message}`);
  logger.error(err.stack);
  res.status(500).send("There was an error serving your request.");
});

let server;

// Global handler for uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
  logger.error(error.stack);
  if (server) {
    server.close(() => {
      logger.info("Server closed after uncaught exception.");
      process.exit(1); // exit application
    });
  } else {
    process.exit(1); // exit immediately if server isn't started yet
  }
});

// Global handler for unhandled promise rejections
process.on('unhandledRejection', (error) => {
  logger.error(`Unhandled promise rejection: ${error.message}`);
  logger.error(error.stack);
  if (server) {
    server.close(() => {
      logger.info("Server closed after unhandled promise rejection.");
      process.exit(1); // exit application
    });
  } else {
    process.exit(1); // exit immediately if server isn't started yet
  }
});

server = app.listen(port, () => {
  logger.info(`Server running at http://localhost:${port}`);
  // Enhanced server startup message for clarity
  console.log(`Server successfully started and is listening on port ${port}`);
});