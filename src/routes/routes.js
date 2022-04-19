const express = require("express")
const router =express.Router()

const UserController = require("../Controller/UserController")
const ProductController = require("../Controller/ProductController")
const CartController = require("../Controller/CartController")
const Middleware = require("../Middleware/auth")
const orderController =require("../Controller/OrderController")

router.post('/register',UserController.createUser)

router.post('/login',UserController.UserLogin)

router.get('/user/:userId/profile',Middleware.authentication,UserController.getUser)

router.put('/user/:userId/profile',Middleware.authentication,Middleware.authorization, UserController.UpdateUser)

router.post('/products',ProductController.CreateProduct)

router.get('/products',ProductController.getProducts)

router.get('/products/:productId',ProductController.getProductById)

router.put('/products/:productId',ProductController.updateProductById)

router.delete('/products/:productId',ProductController.deleteProduct)

router.post('/users/:userId/cart',Middleware.authentication,Middleware.authorization,CartController.addToCart)

router.put('/users/:userId/cart',Middleware.authentication,Middleware.authorization,CartController.updateCart)

router.get('/users/:userId/cart',Middleware.authentication,Middleware.authorization,CartController.getCart)

router.delete('/users/:userId/cart',Middleware.authentication,Middleware.authorization,CartController.deleteCart)

router.post('/users/:userId/order',Middleware.authentication,Middleware.authorization,orderController.createOrder)

router.put('/users/:userId/order',Middleware.authentication,Middleware.authorization,orderController.updateOrder)

module.exports=router