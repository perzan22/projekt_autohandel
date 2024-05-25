const express = require('express')

const router = express.Router()

const ChatControllers = require('../controllers/chat')

router.post('/open', ChatControllers.openChat)

router.get('/:id', ChatControllers.getChat)

router.get('', ChatControllers.getMessages)

module.exports = router