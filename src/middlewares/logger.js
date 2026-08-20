// /src/middlewares/logger.js
// logs every req, how long does it take to finish

const logger = (req, res, next) => {
    const start = Date.now();
    console.log(`Request started: ${req.method} ${req.url}`);
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`Request finished: ${req.method} ${req.url} - ${duration}ms`);
    });
    next();
}
module.exports = logger;
