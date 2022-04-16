const mongoose = require('mongoose');
const cartModel = require('../models/cartModel');
const { findOne } = require('../models/cartModel');
const CartModel = require('../models/cartModel');
const ProductModel = require('../models/ProductModel');
const UserModel = require('../models/UserModel');

const addToCart = async function(req,res){
    let userId = req.params.userId;
    let productId = req.body.items[0].productId;
    let quantity = req.body.items[0].quantity;

    try {
        
        let UserCart = await cartModel.findOne({userId:userId});
        console.log(typeof UserCart);
        let productIdPresent  = await ProductModel.findOne({_id:productId})

        if(!productIdPresent){
         return res.status(400).send({status:false,message:"false",data:"product is not present"})        
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
                return res.status(200).send({status:true,msg:"true",data:UserCart});

            }else{

                UserCart.items.push({productId,quantity});
                UserCart.totalPrice =  UserCart.totalPrice + price * quantity;
                UserCart.totalItems =  UserCart.totalItems + quantity
                await UserCart.save();
                return res.status(200).send({status:true,msg:"true",data:UserCart})
            }


            //no cart exists, create one

         }else{
             const newUserCart = await CartModel.create({
                 userId:userId,
                 items:[{productId,quantity}],
                 totalPrice: quantity*price,
                 totalItems:quantity     
             })

             return res.status(201).send({status:true,msg:"true",data:newUserCart})
         }


    } catch (error) {
        return res.status(500).send({msg:error.message});
    }
}


const updateCart = async function(req,res){
  let cartId = req.body.cartId;
  let productId = req.body.productId;
    // console.log(productId);
  let isCartIdPresent = await cartModel.findOne({_id:cartId});
//  console.log(isCartIdPresent);
  if(!isCartIdPresent){
      return res.status(400).send({status:false,msg:"false",data:"Cart Id is not present"})
  }

  let isProductIdPresent = await ProductModel.findOne({_id:productId});
//   console.log(isProductIdPresent);
  if(!isProductIdPresent){
    return res.status(400).send({status:false,msg:"false",data:"Cart Id is not present"})
    }

    let price = isProductIdPresent.price;

    if(isCartIdPresent){
    let findIndex = isCartIdPresent.items.findIndex((item)=>(item.productId == productId))


    if(findIndex>-1){
    let item = isCartIdPresent.items[findIndex];
    if(item.quantity == 1){
        return res.status(400).send({data:"Product is cannot be less then one"})
    }
    // console.log(item);
    item.quantity = item.quantity  - 1;
    // console.log(item);
    isCartIdPresent.totalItems = isCartIdPresent.totalItems - 1;
    isCartIdPresent.totalPrice = isCartIdPresent.totalPrice - price;
    isCartIdPresent.items[findIndex] = item;
    let updatedCart = await cartModel.findByIdAndUpdate(cartId,isCartIdPresent,{new:true})
    return res.status(200).send({status:true,msg:"true",data:updatedCart})

    }else{
        return res.status(400).send({status:false,msg:"false",data:"Product is not present in cart or its already deleted"})
    }

    }else{
        return res.status(400).send({status:false,msg:"false",data:"Cart is empty for the user"})
    }
}



module.exports.updateCart = updateCart
module.exports.addToCart = addToCart



// const addToCart = async function(req,res){
//     const {userId} = req.body;
//     // console.log(req.body.items[0].productId);
//     let productId = req.body.items[0].productId;
//     let quantity = req.body.items[0].quantity
//     // let requestBody = req.body;
//     try {
   
//         // Finding User is present or not if present take out the cart product

//         let user = await CartModel.findOne({userId:userId})
       
       
//         // if(!user){
//         //     return res.status(400).send({status:false,message:"false",data:"User is not present"})
//         // }

//         // Now check the product Id we got to add in cart is present or it is falsy value

//         let product = await ProductModel.findOne({_id:productId});
//         console.log(product);
//         if(!product){
//             return res.status(400).send({status:false,message:"false",data:"product is not present"})

//         }

//         // after fetching the product now we take out price from there
//         let price = product.price;
    
        
//         if(user){

//             // Here we are checking for the login User which has a cart

//             // Below we are finding inside user items is there any product is available with the product Id we have right in mongodb 
//             // If present pass me the index of that element

//             let itemIndex = user.items.findIndex((item)=>(item.productId === productId))
       
//             // if value is present it will return index else -1

//             if(itemIndex>-1){
//                 // if elemenet is present then go and take out the value of that
                
//                 let newProduct = user.items[itemIndex]
//                 // newProduct will have everything whihc is insert inside the items[index]

//                 // increase the quantity of the items if item quantity was 1 then increase the quanity with the quanity is given
//                 newProduct.quantity += quantity

//                 // insert value of the total price of that products by 
//                 user.items[itemIndex] = newProduct;
//                 user.totalPrice = user.totalPrice + (quantity * price)
//                 // let cartCreate = await cartModel.findOneAndUpdate({userId:userId},user,{new:true})
//                 user.save()
//                 return res.status(200).send({status:true,message:"true",data:user})
//             }else{
                
//                 user.items.push({productId,quantity})
//                 user.totalPrice = price;
//                 user.quantity=quantity;
//                 user.save()
//                 // let cartInsert = await CartModel.findOneAndUpdate({userId:userId},user,{new:true});
//                 return res.status(200).send({status:true,message:"true",data:cartInsert})

//             }
       
       
       
//         }else{
//             // No cart exists ,creating new One

//             const cartNew = await CartModel.create({
//                 userId:userId,
//                 items:[{productId,quantity}],
//                 totalPrice:price,
//                 totalItems:quantity
//             })

//             return res.status(201).send({status:true,msg:"true",data:cartNew})



//         }


//     } catch (error) {
//         return res.status(500).send({msg:error.message})
//     }




// }
