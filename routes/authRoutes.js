<<<<<<< HEAD
import express from 'express';
import { User } from '../models/User.js';
import bcrypt from 'bcrypt';
const router = express.Router();

router.get('/auth/register', (req, res) => {
  res.render('register', { session: req.session });
=======
const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const router = express.Router();

router.get('/auth/register', (req, res) => {
  res.render('register');
>>>>>>> heroku/master
});

router.post('/auth/register', async (req, res) => {
  try {
<<<<<<< HEAD
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log(`Registration attempt with existing username: ${username}`);
      return res.status(400).send('Username already exists. Please choose a different username.');
    }
    // User model will automatically hash the password using bcrypt
    const newUser = await User.create({ username, password });
    console.log(`New user registered: ${newUser.username}`);
    res.redirect('/auth/login');
  } catch (error) {
    console.error('Registration error:', error);
    console.error(error.stack);
    res.status(500).send('An error occurred during registration. Please try again.');
=======
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
>>>>>>> heroku/master
  }
});

router.get('/auth/login', (req, res) => {
<<<<<<< HEAD
  res.render('login', { session: req.session });
=======
  res.render('login');
>>>>>>> heroku/master
});

router.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
<<<<<<< HEAD
      console.log(`Login attempt for non-existent user: ${username}`);
=======
      console.log('Login attempt failed: User not found', username); // Logging failed login attempt
>>>>>>> heroku/master
      return res.status(400).send('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      req.session.userId = user._id;
<<<<<<< HEAD
      console.log(`User logged in: ${user.username}`);
      res.redirect('/');
    } else {
      console.log(`Incorrect password attempt for user: ${username}`);
=======
      console.log('User logged in successfully:', username); // Logging successful login
      return res.redirect('/');
    } else {
      console.log('Login attempt failed: Incorrect password', username); // Logging incorrect password attempt
>>>>>>> heroku/master
      return res.status(400).send('Password is incorrect');
    }
  } catch (error) {
    console.error('Login error:', error);
<<<<<<< HEAD
    console.error(error.stack);
    return res.status(500).send('An error occurred during login. Please try again.');
=======
    res.status(500).send(error.message);
>>>>>>> heroku/master
  }
});

router.get('/auth/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
<<<<<<< HEAD
      console.error('Error during session destruction:', err);
      console.error(err.stack);
      return res.status(500).send('Error logging out');
    }
    console.log('User logged out successfully');
=======
      console.error('Error during session destruction:', err); // Logging error during session destruction
      return res.status(500).send('Error logging out');
    }
    console.log('User logged out successfully'); // Logging successful logout
>>>>>>> heroku/master
    res.redirect('/auth/login');
  });
});

<<<<<<< HEAD
export default router;
=======
module.exports = router;
>>>>>>> heroku/master
