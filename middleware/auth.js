const jwt = require('jsonwebtoken');

// Middleware to protect routes
function auth(req, res, next) {
    const token = req.cookies.token;  // Get token from cookies

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        req.user = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
}

module.exports = auth;
