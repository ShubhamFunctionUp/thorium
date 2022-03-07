const userModel = require('../models/userModel');
const productModel = require('../models/product')
const orderModel = require('../models/order');
const orderFun = async function (req,res) {
    let productId = req.body.productId;
    let userId = req.body.userId;
    let userPresent = await userModel.findById(userId);
    let productPresent =await productModel.findById(productId);
    console.log((userPresent===null && productPresent!==null));

    if(userPresent===null && productPresent===null){
        return res.send("User and Product both not present")

    }else if(userPresent===null && productPresent!==null){

        return res.send("User not present")

    }else if(userPresent!==null && productPresent===null){
        return res.send("Product not present");
    }else{
        



    }
    

}

module.exports.orderFun = orderFun