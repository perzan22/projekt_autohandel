const express = require('express')
const multer = require('multer')
const fileExtractor = require('../middlewares/file')

const router = express.Router()

const ProfilesControllers = require('../controllers/profiles')
const checkAuth = require('../middlewares/check-auth');

router.post('', checkAuth, fileExtractor, ProfilesControllers.createProfile)

router.get('/:id', checkAuth, ProfilesControllers.getProfile)

router.put('/:id', checkAuth, multer().none(), ProfilesControllers.editProfile)

module.exports = router

