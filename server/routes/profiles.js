const express = require('express')
const multer = require('multer')

const router = express.Router()

const ProfilesControllers = require('../controllers/profiles')
const checkAuth = require('../middlewares/check-auth');

router.post('', checkAuth, multer().none(), ProfilesControllers.createProfile)

module.exports = router

