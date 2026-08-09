const errorHandler = (err, req, res, next) => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const statusCode = err.statusCode || err.status || 500;
  const isDevelopment = nodeEnv === 'development';

  console.error('Error:', {
    message: err.message,
    status: statusCode,
    url: req.originalUrl,
    method: req.method,
    ...(isDevelopment && { stack: err.stack })
  });

  const response = {
    success: false,
    message: err.message || 'Internal Server Error',
    statusCode,
    ...(isDevelopment && { stack: err.stack })
  };

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
