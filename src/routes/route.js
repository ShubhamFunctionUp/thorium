const express = require('express');
const router = express.Router();
const BookController = require('../controller/bookcontroller');
const UserController = require('../controller/userController');
const reviewController = require('../controller/reviewController');
const middleware = require('../middleware/auth')
// -------------------User route--------------------------------
router.post('/createUser',UserController.createUser);
router.post('/login',UserController.login);
// ------------------book route----------------------------------
router.post('/createBook',middleware.authorization,BookController.createBook)
router.get('/books',BookController.findBook)
router.get('/books/:bookId',middleware.authorization,BookController.getBookById)
router.put('/books/:bookId',middleware.authorization,BookController.updateBook)
router.delete('/books/:bookId',middleware.authorization,BookController.deleteBook);
// ----------------review----------------------------------------
router.post('/books/:bookId/review',middleware.authentication,reviewController.createReview);
router.delete('/books/:bookId/review/:reviewId',middleware.authentication,reviewController.deletedReview)
module.exports = router;