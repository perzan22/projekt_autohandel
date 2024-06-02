const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const commentSchema = mongoose.Schema({
    tresc: { type: String, required: true },
    autor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    data: { type: Date, required: true },
    ocena: { type: Number }
})

commentSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Comment', commentSchema);