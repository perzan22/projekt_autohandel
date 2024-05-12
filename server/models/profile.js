const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

const profileSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    nickname: { type: String, required: true, unique: true },
    imie: { type: String, required: true },
    nazwisko: { type: String, required: true },
    adres: { type: String, required: true },
    miasto: { type: String, required: true },
    nrTelefonu: { type: String, required: true },
    avatarPath: { type: String, required: true, default: 'http://localhost:3000/images/avatars/default_avatar.jpg' },
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true }
})

profileSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Profile', profileSchema);