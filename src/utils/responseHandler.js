//src/utils/responseHandler.js
const responseHandler = (res, statusCode, message, data = null) => {
const isSuccess = statusCode >= 200 && statusCode < 300;

  res.status(statusCode).json({
    success: isSuccess,
    message,
    statusCode,
    data,
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
    responseHandler,
}
