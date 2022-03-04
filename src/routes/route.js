const express = require('express');
const router = express.Router();
const controller = require('../controllers/allcontroller')

router.post('/createAuthor',controller.createAuthor);
router.post('/createPublisher',controller.createPublisher);
router.post('/createBook',controller.createBook);
router.put('/books',controller.allBooks)





module.exports = router;