const corsOptions = {
  origin: function(origin, callback) {
    const allowedOrigins = [process.env.CORS_ORIGIN || 'http://localhost:3001', 'https://example.com']; // Add all origins that should be allowed by CORS
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.error(`CORS policy does not allow access from this origin: ${origin}`);
      callback(new Error('Not allowed by CORS'), false);
    }
  }, 
  credentials: true,
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
};