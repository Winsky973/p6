const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodeToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodeToken.userId;
        req.auth = { userId };
        console.log('auth : ', req.auth);
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid userId';
        } else {
            next();
        }

    } catch (error) {
        res.status(401).json({ error: error | 'Requête non authentifié !' });
    }
};