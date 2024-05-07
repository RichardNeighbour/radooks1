<<<<<<< HEAD
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { logger } from '../utils/logger.js'; // Assuming logger is exported from utils/logger.js
=======
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const emailValidator = (email) => {
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(email);
};
>>>>>>> heroku/master

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
<<<<<<< HEAD
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
=======
  email: { 
    type: String, 
    unique: true, 
    required: true,
    validate: [emailValidator, 'Please fill a valid email address']
  },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user'
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
>>>>>>> heroku/master
});

userSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) return next();
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
<<<<<<< HEAD
      logger.error('Error hashing password:', err);
      logger.error(err.stack);
=======
      console.error('Error hashing password:', err);
>>>>>>> heroku/master
      return next(err);
    }
    user.password = hash;
    next();
  });
});

<<<<<<< HEAD
userSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    logger.error(`Registration error: Duplicate username ${doc.username}. Error: ${error}`);
    logger.error(error.stack);
    next(new Error('Username already exists. Please choose a different username.'));
  } else {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

export { User };
=======
const User = mongoose.model('User', userSchema);

module.exports = User;
>>>>>>> heroku/master
