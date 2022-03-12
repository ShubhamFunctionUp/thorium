const express = require('express');
const router = express.Router();
const CowinController= require("../controllers/cowinController")
const memesController = require('../controllers/memes')
const weather = require('../controllers/weather')

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})


router.get("/cowin/states", CowinController.getStates)
router.get("/cowin/districtsInState/:stateId", CowinController.getDistricts)
router.get("/cowin/getByPin", CowinController.getByPin)
router.get('/cowin/findByDistrict',CowinController.findByDistricts)
router.post("/cowin/getOtp", CowinController.getOtp)
router.post('/memes',memesController.memes)
// WRITE A GET API TO GET THE LIST OF ALL THE "vaccination sessions by district id" for any given district id and for any given date
router.get('/weather',weather.weatherApi)


module.exports = router;