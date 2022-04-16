const express = require('express');
const router = express.Router();    
const UserController = require('../controller/UserController')
const ProductController = require('../controller/productController');
const CartController = require('../controller/cartController');
const cartModel = require('../models/cartModel');


router.get("/test-me", function (req, res) {
  res.send("My first ever api!")
})

router.post('/register',UserController.register)
router.get('/user/:userId/profile',UserController.getUser)
router.put('/user/:userId/profile',UserController.updateUser)




// Product Router
router.post('/products',ProductController.CreateProduct)
router.get('/products',ProductController.getProducts)
router.get('/products/:productId',ProductController.getProductById)
router.delete('/products/:productId',ProductController.deleteProduct)

// Cart Router

router.post('/users/:userId/cart',CartController.addToCart);
router.put('/users/:userId/cart',CartController.updateCart);


module.exports = router;