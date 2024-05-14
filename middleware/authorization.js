const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    try {
        jwt.verify(token, process.env.JWT_KEY);
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Invalid token' });
    }
}

exports.clientAuthMiddleware = (req, res, next) => {
    const authCookies = req.cookies['access-token'];

    if (!authCookies || !authCookies.startsWith('Bearer ')) {
        res.writeHead(302, { Location: '/login' });
        res.end();
        return;
    }

    const token = authCookies.split(' ')[1];

    try {
        jwt.verify(token, process.env.JWT_KEY);
        next();
    } catch (error) {
        console.error(error);
        res.writeHead(302, { Location: '/login' });
        res.end();
        return;
    }
}