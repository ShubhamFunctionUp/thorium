const express = require('express');
const router = express.Router();
const userController= require("../controllers/userController")

const middleware = require('../middleware/auth')
router.post('/createUsers',userController.createUser)
router.post('/login',middleware.loginUser,userController.loginUser)
router.get('/getUser/:userId',middleware.isConnected,userController.getUserData)
router.put('/updateUser/:userId',middleware.isConnected,userController.updateUser);
router.delete('/deleteuser/:userId',middleware.isConnected,userController.deleteUser)

// router.get("/test-me", function (req, res) {
//     res.send("My first ever api!")
// })

// router.post("/users", userController.createUser  )

// router.post("/login", userController.loginUser)

// //The userId is sent by front end
// router.get("/users/:userId", userController.getUserData)

// router.put("/users/:userId", userController.updateUser)




module.exports = router;