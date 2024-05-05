const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const router = express.Router();

router.get('/auth/register', (req, res) => {
  res.render('register');
});

router.post('/auth/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    await User.create({ username, password, email });
    console.log('User registered successfully:', username); // Logging user registration
    res.redirect('/auth/login');
  } catch (error) {
    console.error('Registration error:', error);
    // Handle duplicate email error specifically
    if (error.code === 11000) {
      console.error('Duplicate email error:', error.message); // Logging the duplicate email error
      return res.status(400).send('Email already exists');
    }
    res.status(500).send(error.message);
  }
});

router.get('/auth/login', (req, res) => {
  res.render('login');
});

router.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      console.log('Login attempt failed: User not found', username); // Logging failed login attempt
      return res.status(400).send('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      req.session.userId = user._id;
      console.log('User logged in successfully:', username); // Logging successful login
      return res.redirect('/');
    } else {
      console.log('Login attempt failed: Incorrect password', username); // Logging incorrect password attempt
      return res.status(400).send('Password is incorrect');
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send(error.message);
  }
});

router.get('/auth/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error during session destruction:', err); // Logging error during session destruction
      return res.status(500).send('Error logging out');
    }
    console.log('User logged out successfully'); // Logging successful logout
    res.redirect('/auth/login');
  });
});

module.exports = router;