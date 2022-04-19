const ProductModel = require('../models/ProductModel')
const UserModel = require('../models/UserModel');
const validator = require('../validator/validator')
const orderModel = require('../models/orderModel');
const mongoose = require('mongoose')

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

const createOrder = async function(req,res){
    let userId = req.params.userId;
    let items = req.body.items;    

   try {
    if(!isValidObjectId(userId)){
        return res.status(400).send({status:false,msg:"userId is not in correct format"})
    }

    let userIsPresentInOrder = await UserModel.findOne({userId:userId});

    if(!userIsPresentInOrder){
        return res.status(400).send({status:false,msg:"User doesn't exist"})
    }

        let requestBody = req.body;
       
        let productId = req.body.productId;
        let quantity = req.body.quantity;

        let {totalItems,totalQuantity} = req.body;
        
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
        let totalPrice = isProductIdPresent.price * quantity
        console.log(isProductIdPresent.price * quantity);
  
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
            items:[{productId,quantity}],
            totalPrice: totalPrice,
            totalItems:totalItems,
           
            totalQuantity:totalQuantity

        })

 return res.status(201).send({status:true,msg:"Order Placed Successfully",data:newUserOrder});
   } catch (error) {
       return res.status(500).send({msg:error.message})
   }


}


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







// const createOrder = async function(req,res){
//     let userId = req.params.userId;
//     let items = req.body.items;    

//    try {
//     if(!validator.isValidObjectId(userId)){
//         return res.status(400).send({status:false,msg:'false',data:"Object Id is not in correct format"})
//     }

//     let userIsPresentInOrder = await UserModel.findOne({userId:userId});

//     if(!userIsPresentInOrder){
//         return res.status(400).send({status:false,msg:"false",data:"User doesn't exist"})
//     }

//         let requestBody = req.body;
//         // let productId = req.body.productId;
//         // let quanity = req.body.quanity;

//         let {cancellable,status,totalItems,totalPrice,totalQuantity} = req.body;

//         // if(validator.isValidObjectId(productId)){
//         //     return res.status(400).send({status:false,msg:'false',data:"Object Id is not in correct format productId"})

//         // }

//         // if(!validator.isValid(quanity)){
//         //     return res.status(400).send({status:false,msg:'false',data:"Quantity is present"})

//         // }

//         if(!validator.isValid(cancellable)){
//             return res.status(400).send({status:false,msg:'false',data:"Cancellation is not inserted"})

//         }

//         if(!validator.isValid(status)){
//             return res.status(400).send({status:false,msg:'false',data:"status is not inserted"})

//         }


//         // let productIsPresent = await ProductModel.findOne({_id:productId});
//         // if(!productIsPresent){
//         //     return res.status(400).send({status:false,msg:'false',data:"Product is not present"})
//         // }

     
//         const newUserOrder = await orderModel.create({
//             userId:userId,
//             items:items,
//             totalPrice: totalPrice,
//             totalItems:totalItems,
//             cancellable:cancellable,
//             status:status,
//             totalQuantity:totalQuantity

//         })



//         return res.status(201).send({status:true,msg:"true",data:newUserOrder});
//    } catch (error) {
//        return res.status(500).send({msg:error.message})
//    }


// }



// const createOrder = async function(req,res){
//     let userId = req.params.userId;
//     let items = req.body.items;    

//    try {
//     if(!isValidObjectId(userId)){
//         return res.status(400).send({status:false,msg:'false',data:"Object Id is not in correct format"})
//     }

//     let userIsPresentInOrder = await UserModel.findOne({userId:userId});

//     if(!userIsPresentInOrder){
//         return res.status(400).send({status:false,msg:"false",data:"User doesn't exist"})
//     }

//         let requestBody = req.body;
       
//         let productId = req.body.items[0].productId;
//         let quantity = req.body.items[0].quantity;

//         let {totalItems,totalPrice,totalQuantity} = req.body;

//         if(!isValidRequestBody(requestBody)){
//             return res.status(400).send({status:false,msg:"No input provided"})
//         }

//         if(!isValid(productId)){
//             return res.status(400).send({status:false,msg:"Please Provide productId"})

//         }

        
//         if(!isValidObjectId(productId)){
//             return res.status(400).send({status:false,msg:"Object Id is not in correct format productId"})

//         }

//         let isProductIdPresent = await ProductModel.findOne({_id:productId});
  
//     if(!isProductIdPresent){
//       return res.status(400).send({status:false,msg:"productId is not present in our db"})
//       }
  
//       if(!isValid(quantity)){
//         return res.status(400).send({status:false,msg:"Please Provide quantity"})

//     }

//     if(!isValid(totalPrice)){
//         return res.status(400).send({status:false,msg:"Please Provide totalPrice"})

//     }

//     if(!isValid(totalItems)){
//         return res.status(400).send({status:false,msg:"Please Provide totalItems"})

//     }

//     if(!isValid(totalQuantity)){
//         return res.status(400).send({status:false,msg:"Please Provide totalQuantity"})

//     }


     
//         const newUserOrder = await orderModel.create({
//             userId:userId,
//             items:items,
//             totalPrice: totalPrice,
//             totalItems:totalItems,
           
//             totalQuantity:totalQuantity

//         })

//  return res.status(201).send({status:true,msg:"Order Placed Successfully",data:newUserOrder});
//    } catch (error) {
//        return res.status(500).send({msg:error.message})
//    }


// }


// const updateOrder = async function(req,res){

//     let userId = req.params.userId;
//     let isUserExist = await UserModel.findOne({userId:userId})
//     let statusQuery = req.query.status;
//     if(!isUserExist){
//         return res.status(400).send({status:false,message:"User doesn't exist"})
//     }

//     try {
//             let orderId = req.body.orderId
//             let takeOutOrder = await orderModel.findOne({_id:orderId,isDeleted:false})
           
//             if(!takeOutOrder){
//                 return res.status(404).send({status:false,message:"Order is not found"})
//             }

//             if(takeOutOrder.userId != userId){
//                 return res.status(400).send({status:false,message:"Order user and login user is not same"})
//             }

//             let cancellableCheck = takeOutOrder.cancellable;
//             if(cancellableCheck==true){
//                 if(statusQuery=="cancelled"){
//                     let cancelledOrder = await orderModel.findOneAndUpdate({_id:orderId,isDeleted:false},{$set:{status:statusQuery,isDeleted:true,deletedAt:Date.now()}},{new:true})
//                    return res.status(200).send({status:true,message:"Order cancelled Successfully",data:cancelledOrder})             
//                 }else{
//                     takeOutOrder.status = statusQuery
//                     let updateOrder =  takeOutOrder.save();
//                   return  res.status(200).send({status:true,message:"Order status updated Successfully",data:updateOrder}) 
//                 }
                
//             }else{
//                 return res.status(400).send({status:false,message:"Cancellation is not allowed"})
//             }

           
                        

//         } catch (error) {
//         return res.status(500).send({msg:error.message})
//     }


// }


// module.exports.updateOrder = updateOrder
// module.exports.createOrder = createOrder;