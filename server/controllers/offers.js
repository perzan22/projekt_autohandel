const Offer = require('../models/offer')
const Car = require('../models/car')


exports.createOffer = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');

    let imagePath = req.file.filename
    
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
        creator: req.userData.userID,
        imagePath: url + '/images/cars/' + imagePath,
        date: Date.now()
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

        return Car.findOne({ marka: req.body.marka, model: req.body.model });
    })
    .then(car => {
        if (!car) {
            const newCar = new Car({
                marka: req.body.marka,
                model: req.body.model
            });

            return newCar.save();
        }
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({
            message: 'Creating offer failed!'
        })
    })
}

exports.getRandomOffers = (req, res, next) => {
    Offer.aggregate([{ $sample: { size: 5 } }]).exec().then(documents =>
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

exports.editOffer = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/images/cars/' + req.file.filename;
    }

    const offer = new Offer({
        _id: req.body.id,
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
        creator: req.userData.userID,
        imagePath: imagePath,
        date: Date.now()
    });

    Offer.updateOne({_id: req.body.id, creator: req.userData.userID}, offer).then(result => {
        if (result.matchedCount > 0) {
            res.status(200).json({ message: 'Offer updated successfully!' })
        } else {
            res.status(401).json({ message: 'Not authorized' })
        }
    })
    .catch(error => {
        res.status(500).json({
            message: `Couldn't edit an offer`
        })
    });
}

exports.getOffersSearch = (req, res, next) => {

    const marka = req.query.marka
    const model = req.query.model
    const cenaMin = req.query.cena_min ? +req.query.cena_min : null;
    const cenaMax = req.query.cena_max ? +req.query.cena_max : null
    const rokProdukcjiMin = req.query.rok_produkcji_min ? +req.query.rok_produkcji_min : null
    const rokProdukcjiMax = req.query.rok_produkcji_max ? +req.query.rok_produkcji_max : null
    const przebiegMax = req.query.przebieg_max ? +req.query.przebieg_max : null
    const rodzajPaliwa = req.query.rodzaj_paliwa

    let query = {};

    if (marka) {
        query.marka = marka
    }

    if (model) {
        query.model = model
    }

    if (cenaMin !== null || cenaMax !== null) {
        query.cena = {};
        if (cenaMin !== null) {
            query.cena.$gte = cenaMin;
        }
        if (cenaMax !== null) {
            query.cena.$lte = cenaMax;
        }
    }

    if (rokProdukcjiMin !== null || rokProdukcjiMax !== null) {
        query.rok_produkcji = {};
        if (rokProdukcjiMin !== null) {
            query.rok_produkcji.$gte = rokProdukcjiMin;
        }
        if (rokProdukcjiMax !== null) {
            query.rok_produkcji.$lte = rokProdukcjiMax;
        }
    }
    if (przebiegMax !== null) {
        query.przebieg = { $lte: przebiegMax };
    }
    if (rodzajPaliwa) {
        query.rodzaj_paliwa = rodzajPaliwa;
    }

    Offer.find(query).then(offers => {
        res.status(200).json({ 
            message: "Offers fetched successfully",
            offers: offers 
        });
       // console.log(offers)
    }).catch(error => {
        res.status(500).json({
            message: 'Fetching offers failed!',
            error: error
        });
    });
}