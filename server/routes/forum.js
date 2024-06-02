const express = require('express')

const router = express.Router()

const ForumControllers = require('../controllers/forum')
const checkAuth = require('../middlewares/check-auth')

router.post('/comment', checkAuth, ForumControllers.addComment)

router.post('', checkAuth, ForumControllers.addPost)

router.get('', ForumControllers.getPosts)

module.exports = router