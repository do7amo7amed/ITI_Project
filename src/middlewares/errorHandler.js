// src/middlewares/errorHandler.js
// centralized error catching middleware

  const errorHandler = (err, req, res, next) => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const isDevelopment = nodeEnv === 'development';
  const statusCode = err.statusCode || err.status || 500;

  // logs full details for debugging
  console.error('Error:', {
    message: err.message,
    status: statusCode,
    url: req.originalUrl,
    method: req.method,
    ...(isDevelopment && { stack: err.stack }), //conditional spreading
  });

  // shows real error if it's expected or in dev env
  const isExpectedError = Boolean(err.statusCode || err.status);
  const clientMessage =
    isDevelopment || isExpectedError
      ? err.message || 'Internal Server Error'
      : 'Internal server error';

  const response = {
    success: false,
    message: clientMessage,
    statusCode,
    ...(isDevelopment && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
