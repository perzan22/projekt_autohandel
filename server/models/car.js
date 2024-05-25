const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const carSchema = mongoose.Schema({
    marka: { type: String, required: true },
    model: { type: String, required: true, unique: true },
}, { unique: true })

carSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Car', carSchema);