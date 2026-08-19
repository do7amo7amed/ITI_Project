const auth= require('./auth');
const logger = require('./logger');
const errorHandler = require('./errorHandler');
const validate = require('./validator');
const notFoundMiddleware = require('./notFoundMiddleware');
//const authorize = require('./authorize');
module.exports = {
    auth,
    logger,
    errorHandler,
    validate,
    notFoundMiddleware ,
//    authorize
}