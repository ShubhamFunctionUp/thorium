const express = require('express');
const router = express.Router();
const authorController = require('../controller/author');
const blogsController = require('../controller/blogs');

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post('/author',authorController.authorCreate);
router.post('/blogs',blogsController.blogsCreate);
router.get('/blogs',blogsController.getBlogs);
router.put('/blogs/:blogId',blogsController.updateBlog);
router.delete('/blogs/:blogId',blogsController.deleteBlog);
router.delete('/blogs',blogsController.deleteBlogs)
module.exports = router;