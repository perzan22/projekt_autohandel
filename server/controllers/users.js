const User = require('../models/user')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.createUser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(hash => {
        const user = new User({
            email: req.body.email,
            nickname: req.body.nickname,
            password: hash,
        });
        user.save().then(createdUser => {
            const token = jwt.sign({ email: createdUser.email, nickname: createdUser.nickname, userID: createdUser._id }, 
            'SECRET_PHRASE_LONG_ENOUGH_to_BE_VALID_SECRET_KEY_OR_NOT');
            res.status(201).json({
                message: 'User created',
                token: token,
                userID: createdUser._id,
                nickname: createdUser.nickname
            })
        })
    })
}

exports.loginUser = (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                throw new Error("Not existing email!")
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password);
        }).then(result => {
            if (!result) {
                return res.status(401).json({
                    message: 'Not valid password!'
                });

            }
            const token = jwt.sign({ email: fetchedUser.email, nickname: fetchedUser.nickname, userID: fetchedUser._id }, 
            'SECRET_PHRASE_LONG_ENOUGH_to_BE_VALID_SECRET_KEY_OR_NOT');
            res.status(200).json({
                token: token,
                userID: fetchedUser._id,
                nickname: fetchedUser.nickname
            })

        })
        .catch(() => {
            return res.status(401).json({
                message: 'Invalid authentication credentials'
            })
        })
}