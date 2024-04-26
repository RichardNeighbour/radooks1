const User = require('../../models/User');

const requireAdmin = async (req, res, next) => {
  if (!req.session || !req.session.userId) {
    console.log('Access denied: No session or userId found');
    return res.status(401).send('You are not authenticated');
  }

  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      console.log(`User with ID ${req.session.userId} not found`);
      return res.status(401).send('User not found');
    }
    if (user.role !== 'admin') {
      console.log(`Access denied: User ${user.username} is not an admin`);
      return res.status(403).send('Access denied. Admin only area.');
    }
    console.log(`Access granted: User ${user.username} is an admin`);
    next();
  } catch (error) {
    console.error('Admin verification error:', error);
    console.error(error.stack);
    res.status(500).send('An error occurred verifying user role');
  }
};

module.exports = requireAdmin;