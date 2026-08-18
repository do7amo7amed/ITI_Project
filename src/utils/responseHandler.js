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

const sendSuccess = (res, data, message, statusCode) => {
   return res.status(statusCode).json({
       success: true,
       message,
       data
   });
};

const sendError = (res, message, statusCode) => {
   return res.status(statusCode).json({
       success: false,
       message
   });
}

module.exports = {
    responseHandler,
   sendSuccess,
   sendError
}