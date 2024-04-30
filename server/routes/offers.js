const express = require('express')
const multer = require('multer')

const router = express.Router()

const OffersControllers = require('../controllers/offers')

router.get('', OffersControllers.getOffers);

router.post('', multer().none(), OffersControllers.createOffer)


module.exports = router;