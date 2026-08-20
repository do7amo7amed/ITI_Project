//src/middlewares/notFoundMiddleware.js
// handles unhandled errors

const notFoundMiddleware = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  error.name = 'NotFoundError';
  res.status(404);
  next(error);
};

module.exports = notFoundMiddleware;
