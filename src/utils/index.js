const {sendSuccess, sendError} = require('./responseHandler');
const {capitalize, slugify, truncate} = require('./stringHelpers');

module.exports = {
    sendSuccess,
    sendError,
    capitalize,
    slugify,
    truncate
}