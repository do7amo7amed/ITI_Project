const jwt = require('jsonwebtoken');
const userService = require('../services/userService');
const { sendError } = require('../utils/responseHandler');

const authenticate = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return sendError(res, 'You are not logged in. Please provide a token.', 401);
    }

  
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback-secret-key'
    );

    
    const currentUser = await userService.findUserById(decoded.id);

    if (!currentUser) {
      return sendError(res, 'The user belonging to this token no longer exists.', 401);
    }

 
    req.user = currentUser;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return sendError(res, 'Invalid or expired token. Please log in again.', 401);
    }
    next(error);
  }
};

module.exports = authenticate;
