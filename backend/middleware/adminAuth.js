const jwt = require('jsonwebtoken');
const { getUsers } = require('../models/User');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const users = getUsers();
    const user = users.find(u => u.id === decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid token' });
  }
};
