const Offer = require('../models/offer')
const Car = require('../models/car')
const Profile = require('../models/profile')


exports.createOffer = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const imagePaths = req.files.map(file => url + '/images/cars/' + file.filename)
    
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
        imagePath: imagePaths,
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
            message: 'Creating offer failed!',
            error: error
        })
    })
}

exports.getRandomOffers = (req, res, next) => {
    Offer.aggregate([{ $sample: { size: 5 } }]).exec().then(documents => {

        let userFavorites = []
        if (req.userData) {
            Profile.findOne({ userID: req.userData.userID }).then(profile => {
                if (profile) {
                    userFavorites = profile.ulubione.map(fav => fav.toString());
                    console.log(userFavorites)

                    const offersWithFavorites = documents.map(offer => {
                        return {
                            ...offer,
                            czyUlubione: userFavorites.includes(offer._id.toString())
                        };
                    });

                    res.status(200).json({
                        message: 'Offers fetched successfully!',
                        offers: offersWithFavorites
                    })
                }
            })
        } else {

            res.status(200).json({
                message: 'Offers fetched successfully!',
                offers: documents
            })
        }
    })
    .catch(error => {
        res.status(500).json({
            message: `Couldn't fetch offers!`,
            error: error
        })
    });
}

exports.getOffer = (req, res, next) => {
    const offerID = req.params.id;
    Offer.findById(offerID).then(offer => {
        if (offer) {

            let isFavorite = false
            if (req.userData) {
                Profile.findOne({ userID: req.userData.userID }).then(profile => {
                    if (profile) {
                        isFavorite = profile.ulubione.includes(offer._id.toString());

                        const offerWithFavorites = {
                            ...offer._doc,
                            czyUlubione: isFavorite
                        }

                        res.status(200).json(offerWithFavorites)
                    }
                })
            } else {
                res.status(200).json(offer)
            }     
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
    const url = req.protocol + '://' + req.get('host');
    const imagePaths = req.files.map(file => url + '/images/cars/' + file.filename)

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
        imagePath: imagePaths,
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
            message: `Couldn't edit an offer`,
            error: error
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
    const sortowanie = req.query.sortowanie
    const pageSize = +req.query.pagesize
    const pageIndex = +req.query.pageindex

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
    let sort
    if (sortowanie === 'cenaDesc') {
        sort = { cena: 'desc' }
    }
    if (sortowanie === 'cenaAsc') {
        sort = { cena: 'asc' }
    }
    if (sortowanie === 'rokProdukcjiAsc') {
        sort = { rok_produkcji: 'asc' }
    }
    if (sortowanie === 'rokProdukcjiDesc') {
        sort = { rok_produkcji: 'desc' }
    }
    if (sortowanie === 'przebiegAsc') {
        sort = { przebieg: 'asc' }
    }
    if (sortowanie === 'przebiegDesc') {
        sort = { przebieg: 'desc' }
    }
    if (sortowanie === 'dateAsc') {
        sort = { date: 'asc' }
    }
    if (sortowanie === 'dateDesc') {
        sort = { date: 'desc' }
    }

    const offerQuery = Offer.find(query)
    if (pageSize && pageIndex) {
        offerQuery.skip(pageSize*(pageIndex - 1)).limit(pageSize)
    } else {
        offerQuery.limit(10)
    }
    offerQuery
    .sort(sort)
    .then(offers => {

        let userFavorites = []
        if (req.userData) {
            Profile.findOne({ userID: req.userData.userID })
            .then(profile => {
                if (profile) {
                    userFavorites = profile.ulubione.map(fav => fav.toString());

                    const offersWithFavorites = offers.map(offer => {
                        return {
                            ...offer._doc,
                            czyUlubione: userFavorites.includes(offer._id.toString())
                        };
                    });
                    return Offer.countDocuments(query).then(count => {
                        res.status(200).json({ 
                            message: "Offers fetched successfully",
                            offers: offersWithFavorites,
                            maxOffers: count 
                        });
                    })   
                }
            })
        } else {
            return Offer.countDocuments(query).then(count => {
                res.status(200).json({ 
                    message: "Offers fetched successfully",
                    offers: offers,
                    maxOffers: count 
                });
            })
        }
        
        
    }).catch(error => {
        res.status(500).json({
            message: 'Fetching offers failed!',
            error: error
        });
    });
}

exports.getUserOffers = (req, res, next) => {
    const userID = req.params.userID

    Offer.find({ creator: userID }).then(offers => {
        res.status(200).json({ 
            message: "Offers fetched successfully",
            offers: offers 
        });
    }).catch(error => {
        res.status(500).json({
            message: 'Fetching offers failed!',
            error: error
        });
    });
}

exports.getFavoritesOffers = (req, res, next) => {
    const userID = req.params.userID

    Profile.findOne({ userID: userID }).then(profile => {

        const favorites = profile.ulubione

        Offer.find({ _id: { $in: favorites } }).then(offers => {

            const offersWithFavorites = offers.map(offer => {

                return {
                    ...offer._doc,
                    czyUlubione: favorites.includes(offer._id.toString())
                };
            })

            res.status(200).json({
                message: 'Offers fetched successfully',
                offers: offersWithFavorites
            })
        })
        .catch(error => {
            res.status(500).json({
                message: 'Offers fetching failed',
                error: error
            })
        })

    })
    .catch(error => {
        res.status(500).json({
            message: 'Profile not found',
            error: error
        })
    })
}