const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const msgSchema = mongoose.Schema({
    offerID: { type: String, required: true },
    sellerID: { type: String, required: true },
    buyerID: { type: String, required: true }
}, { unique: true })

chatSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Chat', chatSchema);