const { sendError } = require('../utils/responseHandler');

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return sendError(res, 'You do not have permission to perform this action', 403);
    }
    next();
  };
};

module.exports = authorize;
