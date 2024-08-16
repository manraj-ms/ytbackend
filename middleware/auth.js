const jwt = require('jsonwebtoken');

// Middleware to protect routes
function auth(req, res, next) {
    const token = req.cookies.token;  // Get token from cookies

    if (!token) {
        return res.sendResponse('No token, authorization denied', null, 401);
    }

    try {
        const decoded = jwt.verify(token, 'jwtsecret');
        req.user = decoded.userId;
        next();
    } catch (error) {
        next(error)
    }
}

module.exports = auth;