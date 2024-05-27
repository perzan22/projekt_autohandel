const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const chatSchema = mongoose.Schema({
    offerID: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer', required: true },
    sellerID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    buyerID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { unique: true })

chatSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Chat', chatSchema);