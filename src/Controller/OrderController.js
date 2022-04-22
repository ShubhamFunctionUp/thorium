const ProductModel = require('../Model/ProductModel')
const UserModel = require('../Model/UserModel');
//const validator = require('../validator/validator')
const orderModel = require('../Model/OrderModel');
const mongoose = require('mongoose')

// <------------------------------ VALIDATION---------------------------------------------->

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
  };
  
  const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
  };
  
  const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId);
  };
  
  const isavailstatus = function (statusQuery) {
    return  ["pending", "completed", "cancelled"].indexOf(statusQuery) !== -1
  }


// <---------------------- CREATE ORDER------------------------------------------------->

const createOrder = async function(req,res){
    let userId = req.params.userId;
    let items = req.body.items;    

   try {
    if(!isValidObjectId(userId)){
        return res.status(400).send({status:false,msg:"userId is not in correct format"})
    }

    let userIsPresentInOrder = await UserModel.findOne({_id:userId});

    if(!userIsPresentInOrder){
        return res.status(400).send({status:false,msg:"false",data:"User doesn't exist"})
    }

        let requestBody = req.body;
       
        let productId = req.body.productId;
        let quantity = req.body.quantity;

        let {totalItems,totalPrice,totalQuantity} = req.body;

        if(!isValidRequestBody(requestBody)){
            return res.status(400).send({status:false,msg:"No input provided"})
        }

        if(!isValid(productId)){
            return res.status(400).send({status:false,msg:"Please Provide productId"})

        }

        
        if(!isValidObjectId(productId)){
            return res.status(400).send({status:false,msg:"productId is not in correct format "})

        }

        let isProductIdPresent = await ProductModel.findOne({_id:productId});
  
    if(!isProductIdPresent){
      return res.status(400).send({status:false,msg:"productId is not present in our db"})
      }
  
      if(!isValid(quantity)){
        return res.status(400).send({status:false,msg:"Please Provide quantity"})

    }

    if(!isValid(totalPrice)){
        return res.status(400).send({status:false,msg:"Please Provide totalPrice"})

    }

    if(!isValid(totalItems)){
        return res.status(400).send({status:false,msg:"Please Provide totalItems"})

    }

    if(!isValid(totalQuantity)){
        return res.status(400).send({status:false,msg:"Please Provide totalQuantity"})

    }


     
        const newUserOrder = await orderModel.create({
            userId:userId,
            items:items,
            totalPrice: totalPrice,
            totalItems:totalItems,
           
            totalQuantity:totalQuantity

        })

 return res.status(201).send({status:true,msg:"Order Placed Successfully",data:newUserOrder});
   } catch (error) {
       return res.status(500).send({msg:error.message})
   }


}

// <---------------------------------- UPDATE ORDER-------------------------------------------->

const updateOrder = async function(req,res){

    let userId = req.params.userId;
    
    let statusQuery = req.query.status;

    if(!statusQuery){
        return res.status(400).send({status:false,msg:"status not provided"})
    }

    
    if(!isavailstatus(statusQuery)){
        return res.status(400).send({status:false,msg:"status shuld be pending canceled completed"})

    }

    if(!isValidObjectId(userId)){
        return res.status(400).send({status:false,msg:"userId is not in correct format"})
    }
    let isUserExist = await UserModel.findOne({userId:userId})
    if(!isUserExist){
        return res.status(400).send({status:false,msg:"User doesn't exist"})
    }

    try {
            let orderId = req.body.orderId
            let requestBody = req.body;

            
        if(!isValidRequestBody(requestBody)){
            return res.status(400).send({status:false,msg:"No input provided"})
        }

            if(!isValid(orderId)){
                return res.status(400).send({status:false,msg:"Please Provide orderId"})
    
            }

            if(!isValidObjectId(orderId)){
                return res.status(400).send({status:false,msg:"orderId is not in correct format "})
    
            }

            let takeOutOrder = await orderModel.findOne({_id:orderId,isDeleted:false})
            if(!takeOutOrder){
                return res.status(404).send({status:false,msg:"Order is not found"})
            }

            if(takeOutOrder.userId != userId){
                return res.status(400).send({status:false,msg:"Order user and login user is not same"})
            }

            let cancellableCheck = takeOutOrder.cancellable;
            if(cancellableCheck==true){
                if(statusQuery=="cancelled"){
                    let cancelledOrder = await orderModel.findOneAndUpdate({_id:orderId,isDeleted:false},{$set:{status:statusQuery,isDeleted:true,deletedAt:Date.now()}},{new:true})
                   return res.status(200).send({status:true,msg:"Order cancelled Successfully"})             
                }else{
                    takeOutOrder.status = statusQuery
                    let updateOrder =  takeOutOrder.save();
                  return  res.status(200).send({status:true,msg:"Order status updated Successfully"}) 
                }
                
            }else{
                return res.status(400).send({status:false,msg:"Cancellation is not allowed"})
            }

           
                        

        } catch (error) {
        return res.status(500).send({msg:error.message})
    }


}


module.exports.updateOrder = updateOrder
module.exports.createOrder = createOrder;