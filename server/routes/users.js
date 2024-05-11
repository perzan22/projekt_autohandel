const express = require('express')

const router = express.Router()

const UsersController = require('../controllers/users');
const checkAuth = require('../middlewares/check-auth');

router.post('/signup', UsersController.createUser);

router.post('/login', UsersController.loginUser);

router.put('/passChange/:id', checkAuth, UsersController.changePassword)

module.exports = router;