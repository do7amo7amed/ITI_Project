const auth= require('./auth');
const logger = require('./logger');
const errorHandler = require('./errorHandler');
const validiator = require('./validiator');
const notFoundMiddleware = require('./notFoundMiddileware');
const authorize = require('./authorize');
module.exports = {
    auth,
    logger,
    errorHandler,
    validiator,
    notFoundMiddleware ,
    authorize
}