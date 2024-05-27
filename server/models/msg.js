const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const msgSchema = mongoose.Schema({
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    date: { type: Date, required: true },
    msg: { type: String, require: true },
    chat: { type: String, require: true }
}, { unique: true })

msgSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Message', msgSchema);