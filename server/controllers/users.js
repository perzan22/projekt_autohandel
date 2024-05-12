const User = require('../models/user')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const passValid = require('../validators/password-validator')

exports.createUser = (req, res, next) => {

    const password = req.body.password
    if(passValid.validate(password)) {
        bcrypt.hash(password, 10).then(hash => {
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
                    nickname: createdUser.nickname,
                    email: createdUser.email
                })
            })
        })
    } else {
        res.status(400).json({ message: 'Hasło nie spełnia polityki haseł.' })
    }

    
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
                nickname: fetchedUser.nickname,
                email: fetchedUser.email,
                profileID: fetchedUser.profileID
            })

        })
        .catch(() => {
            return res.status(401).json({
                message: 'Invalid authentication credentials'
            })
        })
}

exports.changePassword = (req, res, next) => {
    let fetchedUser;
    const userID = req.params.id
    User.findById(userID).then(user => {
        if (user) {
            fetchedUser = user
            const oldPassword = user.password
            return bcrypt.compare(req.body[0], oldPassword).then(result => {
                if (!result) {
                    return res.status(401).json({
                        message: 'Not valid old password'
                    })
                }
                const newPassword = req.body[1]
                if (passValid.validate(newPassword)) {
                    bcrypt.hash(newPassword, 10).then(hash => {
                        fetchedUser.password = hash
                        User.updateOne({_id: req.params.id}, fetchedUser).then(result => {
                            if (result.matchedCount > 0) {
                                res.status(200).json({ message: 'Password updated successfully!' })
                            } else {
                                res.status(401).json({ message: 'Not authorized' })
                            }
                        })
                    })
                } else {
                    res.status(400).json({ message: 'Hasło nie spełnia polityki haseł.' })
                }

            })
        }
    })
}