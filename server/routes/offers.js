const express = require('express')
const multer = require('multer')
const fileExtractor = require('../middlewares/car')

const router = express.Router()

const OffersControllers = require('../controllers/offers');
const checkAuth = require('../middlewares/check-auth');

router.get('/search', OffersControllers.getOffersSearch)

router.get('', OffersControllers.getRandomOffers);

router.post('', fileExtractor, checkAuth, OffersControllers.createOffer)

router.get('/:id', OffersControllers.getOffer)

router.delete('/:id', checkAuth, OffersControllers.deleteOffer)

router.put('/:id', fileExtractor, checkAuth, OffersControllers.editOffer)

module.exports = router;