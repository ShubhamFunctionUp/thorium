const express = require('express');
const router = express.Router();
// const UserModel= require("../models/userModel.js")
const UserController= require("../controllers/userController");
const productController = require("../controllers/productController");
const middleWare = require('../middleware/middleware')
const OrderController = require('../controllers/orderController')
router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post('/createProduct',productController.createProduct)
router.post('/createUser',middleWare.mid1,UserController.createUser)
router.post('/createOrder',middleWare.mid1,OrderController.orderFun)
module.exports = router;