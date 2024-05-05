const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'SECRET_PHRASE_LONG_ENOUGH_to_BE_VALID_SECRET_KEY_OR_NOT');
        req.userData = { email: decodedToken.email, nickname: decodedToken.nickname, userID: decodedToken.userID };
        next();
    } catch (error) {
        res.status(401).json({ message: "You are not authenticated!" });
    }
}