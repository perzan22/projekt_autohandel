const express = require('express')

const router = express.Router()

const ForumControllers = require('../controllers/forum')
const checkAuth = require('../middlewares/check-auth')

router.post('', checkAuth, ForumControllers.addPost)

module.exports = router