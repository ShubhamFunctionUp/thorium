const express = require('express');
const router = express.Router();    
const UserController = require('../controller/UserController')
const ProductController = require('../controller/productController');
router.get("/test-me", function (req, res) {
  res.send("My first ever api!")
})

router.post('/register',UserController.register)
router.get('/user/:userId/profile',UserController.getUser)
router.put('/user/:userId/profile',UserController.updateUser)




// Product Router
// router.post('/products')
router.get('/products/:productId',ProductController.getProductById)
router.delete('/products/:productId',ProductController.deleteProduct)





module.exports = router;