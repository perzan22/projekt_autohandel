const express = require('express')

const router = express.Router()

const CarControllers = require('../controllers/car')

router.get('', CarControllers.getCars)


module.exports = router