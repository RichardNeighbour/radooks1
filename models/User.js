import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { logger } from '../utils/logger.js'; // Assuming logger is exported from utils/logger.js

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

userSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) return next();
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      logger.error('Error hashing password:', err);
      logger.error(err.stack);
      return next(err);
    }
    user.password = hash;
    next();
  });
});

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