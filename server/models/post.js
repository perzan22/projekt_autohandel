const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const postSchema = mongoose.Schema({
    tytul: { type: String, required: true },
    tresc: { type: String, required: true },
    autor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    data_publikacji: { type: Date, required: true },
    ocena: { type: Number },
    avatar: { type: String },
    komentarze: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
})

postSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Post', postSchema);