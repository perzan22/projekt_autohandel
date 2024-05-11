const mongoose = require('mongoose')

const offerSchema = mongoose.Schema({
    nazwa: { type: String, required: true },
    marka: { type: String, required: true },
    model: { type: String, required: true },
    rok_produkcji: { type: Number, required: true },
    przebieg: { type: Number, required: true },
    spalanie: { type: Number, required: true },
    pojemnosc_silnika: { type: Number, required: true },
    rodzaj_paliwa: { type: String, required: true },
    opis: { type: String, required: false },
    cena: { type: Number, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})

module.exports = mongoose.model('Offer', offerSchema)