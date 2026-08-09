const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Authorization header is missing',
                code: 'MISSING_TOKEN'
            });
        }

        const token = authHeader.startsWith('Bearer ')
            ? authHeader.slice(7)
            : authHeader;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token is required',
                code: 'EMPTY_TOKEN'
            });
        }

        jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid or expired token',
                    code: 'INVALID_TOKEN'
                });
            }

            req.user = decoded;
            next();
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Authentication failed',
            code: 'AUTH_ERROR'
        });
    }
};

module.exports = authenticate;
