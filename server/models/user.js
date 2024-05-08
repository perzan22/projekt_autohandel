const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    nickname: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileID: { type: String }
})

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);