const express = require('express')
const multer = require('multer')
const fileExtractor = require('../middlewares/avatar')

const router = express.Router()

const ProfilesControllers = require('../controllers/profiles')
const checkAuth = require('../middlewares/check-auth');

router.post('', checkAuth, fileExtractor, ProfilesControllers.createProfile)

router.get('/:id', checkAuth, ProfilesControllers.getProfile)

router.get('/user/:id', checkAuth, ProfilesControllers.getProfileByUserID)

router.put('/:id', checkAuth, fileExtractor, ProfilesControllers.editProfile)

module.exports = router

