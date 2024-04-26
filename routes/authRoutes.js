import express from 'express';
import { User } from '../models/User.js';
import bcrypt from 'bcrypt';
const router = express.Router();

router.get('/auth/register', (req, res) => {
  res.render('register', { session: req.session });
});

router.post('/auth/register', async (req, res) => {
  try {
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
  }
});

router.get('/auth/login', (req, res) => {
  res.render('login', { session: req.session });
});

router.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      console.log(`Login attempt for non-existent user: ${username}`);
      return res.status(400).send('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      req.session.userId = user._id;
      console.log(`User logged in: ${user.username}`);
      res.redirect('/');
    } else {
      console.log(`Incorrect password attempt for user: ${username}`);
      return res.status(400).send('Password is incorrect');
    }
  } catch (error) {
    console.error('Login error:', error);
    console.error(error.stack);
    return res.status(500).send('An error occurred during login. Please try again.');
  }
});

router.get('/auth/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error during session destruction:', err);
      console.error(err.stack);
      return res.status(500).send('Error logging out');
    }
    console.log('User logged out successfully');
    res.redirect('/auth/login');
  });
});

export default router;