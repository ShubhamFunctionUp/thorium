const ProductModel = require('../models/ProductModel')
const UserModel = require('../models/UserModel');
const validator = require('../validator/validator')
const orderModel = require('../models/orderModel');

const createOrder = async function(req,res){
    let userId = req.params.userId;
    let items = req.body.items;    

   try {
    if(!validator.isValidObjectId(userId)){
        return res.status(400).send({status:false,msg:'false',data:"Object Id is not in correct format"})
    }

    let userIsPresentInOrder = await UserModel.findOne({userId:userId});

    if(!userIsPresentInOrder){
        return res.status(400).send({status:false,msg:"false",data:"User doesn't exist"})
    }

        let requestBody = req.body;
        // let productId = req.body.productId;
        // let quanity = req.body.quanity;

        let {cancellable,status,totalItems,totalPrice,totalQuantity} = req.body;

        // if(validator.isValidObjectId(productId)){
        //     return res.status(400).send({status:false,msg:'false',data:"Object Id is not in correct format productId"})

        // }

        // if(!validator.isValid(quanity)){
        //     return res.status(400).send({status:false,msg:'false',data:"Quantity is present"})

        // }

        if(!validator.isValid(cancellable)){
            return res.status(400).send({status:false,msg:'false',data:"Cancellation is not inserted"})

        }

        if(!validator.isValid(status)){
            return res.status(400).send({status:false,msg:'false',data:"status is not inserted"})

        }


        // let productIsPresent = await ProductModel.findOne({_id:productId});
        // if(!productIsPresent){
        //     return res.status(400).send({status:false,msg:'false',data:"Product is not present"})
        // }

     
        const newUserOrder = await orderModel.create({
            userId:userId,
            items:items,
            totalPrice: totalPrice,
            totalItems:totalItems,
            cancellable:cancellable,
            status:status,
            totalQuantity:totalQuantity

        })



        return res.status(201).send({status:true,msg:"true",data:newUserOrder});
   } catch (error) {
       return res.status(500).send({msg:error.message})
   }


}


const updateOrder = async function(req,res){

    let userId = req.params.userId;
    let isUserExist = await UserModel.findOne({userId:userId})
    let statusQuery = req.query.status;
    if(!isUserExist){
        return res.status(400).send({status:false,msg:"false",data:"User doesn't exist"})
    }

    try {
            let orderId = req.body.orderId
            let takeOutOrder = await orderModel.findOne({_id:orderId,isDeleted:false})
           
            if(!takeOutOrder){
                return res.status(404).send({status:false,msg:"false",msg:"Order is not found"})
            }

            if(takeOutOrder.userId != userId){
                return res.status(400).send({status:false,msg:"false",data:"Order user and login user is not same"})
            }

            let cancellableCheck = takeOutOrder.cancellable;
            if(cancellableCheck==true){
                if(statusQuery=="cancelled"){
                    let cancelledOrder = await orderModel.findOneAndUpdate({_id:orderId,isDeleted:false},{$set:{status:statusQuery,isDeleted:true,deletedAt:Date.now()}},{new:true})
                   return res.status(200).send({status:true,msg:"true",data:"Order cancelled Successfully"})             
                }else{
                    takeOutOrder.status = statusQuery
                    let updateOrder =  takeOutOrder.save();
                  return  res.status(200).send({status:true,msg:"true",data:"Order status updated Successfully"}) 
                }
                
            }else{
                return res.status(400).send({status:false,msg:"true",data:"Cancellation is not allowed"})
            }

           
                        

        } catch (error) {
        return res.status(500).send({msg:error.message})
    }


}


module.exports.updateOrder = updateOrder
module.exports.createOrder = createOrder;