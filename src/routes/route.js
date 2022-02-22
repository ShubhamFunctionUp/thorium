const express = require('express');
let lodder = require("../logger/lodder");
const router = express.Router();
let helper = require('../util/helper');
let trimming = require('../validator/formatter');
let _ = require('lodash');



router.get('/test-me', function (req, res) {
    let obj = lodder.welcome("Shubham");
    console.log(obj);
    res.send("Welcome to my application. I am Shubham and a part of FunctionUp Thorium cohort");
});



router.get('/time',function(req,res){
    let date = helper.printDate();
    let month = helper.printMonth();
    res.send("date");
})

router.get('/batch',function(req,res){
   let [batch,result] =  helper.getBatchInfo();
    res.send(batch,result);
})

router.get('/trim',function(req,res){
    let trim = trimming.triming("Function UP");
    let lower = trimming.lowerCase("FunctionUP")
    let upper = trimming.upperCase("functionup")
    res.send("Trim ");
})

router.get('/hello',function(req,res){
    // let month = ["Jan","Feb","Mar","Apr","May","June","july","Aug","Sep","OCt","Nov","Dec"];
    // _.chunk(month,4);
    // console.log(chunk);
    
    let odd = [3,5,7,9,10,11,13,15,17,19];
    let newOdd = _.tail(odd);
    console.log(newOdd);
    

    let dup1 = [[1,2,3,4],[4,5,6,7]];
    
    let store = _.union(dup1);
    console.log(store);

    
    
    res.send("Hello");

})
module.exports = router;
// adding this comment for no reason