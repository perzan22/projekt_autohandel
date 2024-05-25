const express = require('express')
const multer = require('multer')
const fileExtractor = require('../middlewares/car')

const router = express.Router()

const OffersControllers = require('../controllers/offers');
const checkAuth = require('../middlewares/check-auth');
const checkProfile = require('../middlewares/check-profile')

router.get('/search', checkProfile, OffersControllers.getOffersSearch);

router.get('/my-offers/:userID', checkAuth, OffersControllers.getUserOffers)

router.get('/favorites/:userID', checkAuth, OffersControllers.getFavoritesOffers)

router.get('', checkProfile, OffersControllers.getRandomOffers);

router.post('', fileExtractor, checkAuth, OffersControllers.createOffer)

router.get('/:id', checkProfile, OffersControllers.getOffer)

router.delete('/:id', checkAuth, OffersControllers.deleteOffer)

router.put('/:id', fileExtractor, checkAuth, OffersControllers.editOffer)

module.exports = router;