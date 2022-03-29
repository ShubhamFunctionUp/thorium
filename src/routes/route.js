const express = require('express');
const router = express.Router();
const BookController = require('../controller/bookcontroller');
const UserController = require('../controller/userController');
const reviewController = require('../controller/reviewController');
// -------------------User route--------------------------------
router.post('/createUser',UserController.createUser);
router.post('/login',UserController.login);
// ------------------book route----------------------------------
router.post('/createBook',BookController.createBook)
router.get('/books',BookController.findBook)
router.get('/books/:bookId',BookController.getBookById)
router.put('/books/:bookId',BookController.updateBook)
router.delete('/books/:bookId',BookController.deleteBook);
// ----------------review----------------------------------------
router.post('/books/:bookId/review',reviewController.createReview);
router.delete('/books/:bookId/review/:reviewId',reviewController.deletedReview)
module.exports = router;