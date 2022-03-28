const express = require('express');
const router = express.Router();
const BookController = require('../controller/bookcontroller');
const UserController = require('../controller/userController');
router.post('/createUser',UserController.createUser);
router.post('/login',UserController.login);
router.post('/createBook',BookController.createBook)
router.get('/findBook',BookController.findBook)

module.exports = router;