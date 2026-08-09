// const start = Date.now();
// console.log(`Request started: ${req.method} ${req.url}`);

// GET /api/users
// console.log();


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
