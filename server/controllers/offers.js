const Offer = require('../models/offer')


exports.createOffer = (req, res, next) => {
    
    const offer = new Offer({
        nazwa: req.body.nazwa,
        marka: req.body.marka,
        model: req.body.model,
        rok_produkcji: +req.body.rok_produkcji,
        przebieg: +req.body.przebieg,
        spalanie: +req.body.spalanie,
        pojemnosc_silnika: +req.body.pojemnosc_silnika,
        rodzaj_paliwa: req.body.rodzaj_paliwa,
        opis: req.body.opis,
        cena: +req.body.cena,
        creator: req.userData.userID
    })

    console.log(offer)
    offer.save().then(result => {
        res.status(201).json({
            message: 'Offer added successfully!',
            offer: {
                ...result,
                id: result._id
            }
        });
    })
}

exports.getOffers = (req, res, next) => {
    Offer.find().then(documents =>
        res.status(200).json({
            message: 'Offers fetched succesfully!',
            offers: documents
        })
    );

}

exports.getOffer = (req, res, next) => {
    const offerID = req.params.id;
    Offer.findById(offerID).then(offer => {
        if (offer) {
            res.status(200).json(offer)
        } else {
            res.status(404).json('Offer not found!')
        }
    })
}

exports.deleteOffer = (req, res, next) => {
    Offer.deleteOne({_id: req.params.id}).then(result => {
        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'Deleted successfully' })
        } else {
            res.status(401).json({ message: 'Delete not successfully' })
        }
    })
}