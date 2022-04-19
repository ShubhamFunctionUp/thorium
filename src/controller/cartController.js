const CartModel = require('../Model/CartModel')
const UserModel = require('../Model/UserModel')
const ProductModel = require('../Model/ProductModel')
const mongoose = require('mongoose')

const isValid = function (value) {
    if (typeof value == undefined || value == null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
  };

  const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
  };
  

  let isValidObjectId = function (objectId){
    return mongoose.Types.ObjectId.isValid(objectId)
}

             

const addToCart = async function(req,res){
    try {
    let requestBody = req.body
    let userId = req.params.userId;
   // let items = req.body.items
    let productId = req.body.productId;
   let quantity = req.body.quantity;

   
    


    if(!isValidObjectId(userId)){
        return res.status(400).send({status:false,msg:"userId is not in correct format"})
    }

    let userIsPresent = await UserModel.findOne({_id:userId});

    if(!userIsPresent){
        return res.status(400).send({status:false,msg:"User doesn't exist"})
    }
    if(!isValidRequestBody(requestBody)){
        return res.status(400).send({status:false,msg:"No input provided"})
    }
    



    if(!isValid(productId)){
        return res.status(400).send({status:false,msg:"Please Provide productId"})

    }

    
    if(!isValidObjectId(productId)){
        return res.status(400).send({status:false,msg:"productId is not in correct format "})

    }
        
        let UserCart = await CartModel.findOne({userId:userId});

        let productIdPresent  = await ProductModel.findOne({_id:productId})

        if(!productIdPresent){
         return res.status(400).send({status:false,message:"product is not present"})        
         }

         if(!isValid(quantity)){
            return res.status(400).send({status:false,msg:"Please Provide quantity"})
    
        }

         let price = productIdPresent.price;

         if(UserCart){

            let itemsIndex = UserCart.items.findIndex((item)=>(item.productId == productId))

            if(itemsIndex>-1){

                let product = UserCart.items[itemsIndex];
                product.quantity =product.quantity + quantity;

                UserCart.items[itemsIndex] = product;
                UserCart.totalPrice =  UserCart.totalPrice + price * quantity;
                UserCart.totalItems = UserCart.totalItems + quantity
                await UserCart.save();
                return res.status(200).send(UserCart);

            }else{

                UserCart.items.push({productId,quantity});
                UserCart.totalPrice =  UserCart.totalPrice + price * quantity;
                UserCart.totalItems =  UserCart.totalItems + quantity
                await UserCart.save();
                return res.status(200).send(UserCart)
            }


            //no cart exists, create one

         }else{
             const newUserCart = await CartModel.create({
                 userId:userId,
                 items:[{productId,quantity}],
                 totalPrice: quantity*price,
                 totalItems:quantity     
             })

             return res.status(201).send(newUserCart)
         }


    } catch (error) {
        return res.status(500).send({msg:error.message});
    }
}


const updateCart = async function(req,res){
    let requestBody = req.body
    let removeProduct=req.body.removeProduct
    let userId = req.params.userId;
    let cartId = req.body.cartId;
    let productId = req.body.productId;
      // console.log(productId);

      if(!isValidRequestBody(requestBody)){
        return res.status(400).send({status:false,msg:"No input provided"})
    }
      if(!isValidObjectId(userId)){
        return res.status(400).send({status:false,msg:"userId is not in correct format"})
    }

    let userIsPresent = await UserModel.findOne({_id:userId});

    if(!userIsPresent){
        return res.status(400).send({status:false,msg:"User doesn't exist"})
    }

      if(!isValid(cartId)){
        return res.status(400).send({status:false,msg:"Please Provide cartId"})

    }

      if(!isValidObjectId(cartId)){
        return res.status(400).send({status:false,msg:"cartId is not in correct format"})
    }


    let isCartIdPresent = await CartModel.findOne({_id:cartId});
  //  console.log(isCartIdPresent);
    if(!isCartIdPresent){
        return res.status(400).send({status:false,msg:"Cart Id is not present"})
    }

    if(!isValid(productId)){
        return res.status(400).send({status:false,msg:"Please Provide productId"})

    }

      if(!isValidObjectId(productId)){
        return res.status(400).send({status:false,msg:"productId is not in correct format"})
    }
  
    let isProductIdPresent = await ProductModel.findOne({_id:productId});
  //   console.log(isProductIdPresent);
    if(!isProductIdPresent){
      return res.status(400).send({status:false,msg:"productId is not present"})
      }
  
      let price = isProductIdPresent.price;
  
      if(isCartIdPresent){
          if(removeProduct==1){
      let findIndex = isCartIdPresent.items.findIndex((item)=>(item.productId == productId))
  
  
      if(findIndex>-1){
      let item = isCartIdPresent.items[findIndex];
      if(item.quantity == 1){
          return res.status(400).send({msg:"Product is cannot be less then one"})
      }
      console.log(item);
      item.quantity = item.quantity  - 1;
      console.log(item);
      isCartIdPresent.totalItems = isCartIdPresent.totalItems - 1;
      isCartIdPresent.totalPrice = isCartIdPresent.totalPrice - price;
      isCartIdPresent.items[findIndex] = item;
      let updatedCart = await CartModel.findByIdAndUpdate(cartId,isCartIdPresent,{new:true})
      return res.status(200).send({status:true,msg:"sucess",data:updatedCart})
  
      }else{
          return res.status(400).send({status:false,msg:"Product is not present in cart or its already deleted"})
      }
    }else if(removeProduct==0){

        const itemIndex = isCartIdPresent.items.findIndex((item)=>(item.productId==productId));
        if(itemIndex>-1){
            let item = isCartIdPresent.items[itemIndex];
            isCartIdPresent.totalItems = 0
            isCartIdPresent.totalPrice =0 
            isCartIdPresent.items = []
            
            let cart = await isCartIdPresent.save();
            return res.status(200).send({status:true,msg:"true",data:cart})
        }else{
            return res.status(400).send({status:false,msg:"false",data:"Product is not present in cart or its already deleted"})
        }

    }
      }else{
          return res.status(400).send({status:false,msg:"Cart is empty for the user"})
      }
  }


  const getCart = async function (req, res) {

    try {
        let userId = req.params.userId

        if(!isValidObjectId(userId)){
            return res.status(400).send({status:false,msg:"userId is not in correct format"})
        }

        let data = await CartModel.findOne({ userId: userId })

        //check if cart exist-
        if (!data) {
            return res.status(400).send({ status: false, message: "No such cart exist" })
        }

        //check if user exist-
        let isUserExist = await UserModel.findById(userId)

        if (!isUserExist) {
            return res.status(400).send({ status: false, message: "User doesn't exist" })
        }

        return res.status(200).send({ status: true, message: "Success", data: data })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }

}



const deleteCart = async function (req, res) {

    try {
        let userId = req.params.userId;
        if(!isValidObjectId(userId)){
            return res.status(400).send({status:false,msg:"userId is not in correct format"})
        }

        let data = await CartModel.findOne({ userId: userId })

        //check if cart exist-
        if (!data) {
            return res.status(400).send({ status: false, message: "No such cart exist" })
        }

        
        //check if user exist-
        let isUserExist = await UserModel.findById(userId)

        if (!isUserExist) {
            return res.status(400).send({ status: false, message: "User doesn't exist" })
        }


        let deletedProduct = await CartModel.findOneAndUpdate({ userId: userId }, { $set: { items: [], totalPrice: 0, totalItems: 0 } }, { new: true })

        return res.status(200).send({ status: true, message: true, data: deletedProduct })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }

}

module.exports.addToCart = addToCart
module.exports.updateCart=updateCart
module.exports.getCart = getCart
module.exports.deleteCart=deleteCart