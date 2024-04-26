const express = require('express');
const requireAdmin = require('./middleware/roleMiddleware'); // Adjust the path as necessary
const router = express.Router();

// Placeholder admin dashboard route
router.get('/dashboard', requireAdmin, (req, res) => {
  console.log('Accessing Admin Dashboard');
  res.send('Admin Dashboard - Access Granted');
});

module.exports = router;