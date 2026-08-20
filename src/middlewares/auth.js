// src/middlewares/auth.js
// identifies user making req

//signed string encodes data
const jwt = require('jsonwebtoken'); 
const userService = require('../services/userService');
const { responseHandler } = require('../utils/responseHandler');

const authenticate = async (req, res, next) => {  
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) { 
      return responseHandler(res, 401, 'You are not logged in. Please provide a token.');
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback-secret-key'
    );
    
    const currentUser = await userService.findUserById(decoded.id);

    if (!currentUser) {
      return responseHandler(res, 401, 'The user belonging to this token no longer exists.');
    }
 
    req.user = currentUser;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return responseHandler(res, 401, 'Invalid or expired token. Please log in again.');
    }
    next(error);
  }
};

module.exports = authenticate;
