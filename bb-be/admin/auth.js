const jwt = require('jsonwebtoken');
const authenticate_token = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
        if (error) return res.sendStatus(401);
        req.user = user;
        next();
    });
}

module.exports = {
    authenticate_token
}