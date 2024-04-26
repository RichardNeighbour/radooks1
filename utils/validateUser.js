const mongoose = require('mongoose');
const User = require('../models/User'); // Ensure this path is correct based on your project structure

async function validateUser(userId) {
  console.log(`Validating user with ID: ${userId}`);
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log('Validation failed: userId is not a valid ObjectId.');
      return false;
    }
    const userExists = await User.exists({ _id: userId });
    if (userExists) {
      console.log(`User validation successful for userId: ${userId}`);
      return true;
    } else {
      console.log(`User validation failed: No user found with userId: ${userId}`);
      return false;
    }
  } catch (error) {
    console.error('Error during user validation:', error);
    console.error(error.stack);
    return false;
  }
}

module.exports = validateUser;