const express = require('express');
const router = express.Router();
const authorController = require('../controller/author');


router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post('/author',authorController.authorCreate)

module.exports = router;