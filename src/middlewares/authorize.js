//src/middlewares/authorize.js
// checks permissions

const { responseHandler } = require('../utils/responseHandler');

const authorize = (...allowedRoles) => {  
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return responseHandler(res ,403, 'You do not have permission to perform this action');
    }
    next(); 
  };
};

module.exports = authorize;
