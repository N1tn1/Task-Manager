const User = require('../models/User')
const jwt = require('jsonwebtoken')
const UnauthenticatedError  = require('../errors/unauthenticated-error')

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No or invalid auth header');
    return res.status(404).json({ msg: 'Authentication Invalid' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: payload.user.id };
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    if (error.name === 'TokenExpiredError') {
      return next(new UnauthenticatedError('Authentication invalid: Token expired'));
    }
    return next(new UnauthenticatedError('Authentication invalid: Token verification failed'));
  }
};

module.exports = auth;
