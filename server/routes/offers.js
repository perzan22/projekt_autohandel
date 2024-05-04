const express = require('express')
const multer = require('multer')

const router = express.Router()

const OffersControllers = require('../controllers/offers');
const checkAuth = require('../middlewares/check-auth');

router.get('', OffersControllers.getOffers);

router.post('', multer().none(), checkAuth, OffersControllers.createOffer)


module.exports = router;