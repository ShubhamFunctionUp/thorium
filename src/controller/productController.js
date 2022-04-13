const ProductModel = require('../models/ProductModel')
const mongoose = require('mongoose')
const awsFile = require('../S3/awsFile');
const validator = require('../validator/validator');

// title: {string, mandatory, unique},
// description: {string, mandatory},
// price: {number, mandatory, valid number/decimal},
// currencyId: {string, mandatory, INR},
// currencyFormat: {string, mandatory, Rupee symbol},
// isFreeShipping: {boolean, default: false},
// productImage: {string, mandatory},  // s3 link
// style: {string},
// availableSizes: {array of string, at least one size, enum["S", "XS","M","X", "L","XXL", "XL"]},
// installments: {number},
// deletedAt: {Date, when the document is deleted}, 
// isDeleted: {boolean, default: false},
// createdAt: {timestamp},
// updatedAt: {timestamp},




const createProduct = async function(req,res){
    try{
        let body = req.body;
        if(!validator.isValidRequestBody){
            return res.status(400).send({status:false,msg:"No value is present inside req body"})
        }
        let {title,description,price,currencyId,currencyFormat,isFreeShipping,productImage,style,availableSizes,installments} = body

        for(let i=0;i<Object.keys(body).length;i++){
            console.log(Object.keys(body)[i])
        }





    }catch(err){
        return res.status(500).send({msg:err.message})
    }
}

let getProductById = async function(req,res){
    let productId = req.params.productId;

    try{
        if(!isValidObjectId(productId)){
            return res.status(400).send({status:false,message:"Not a Valid Object ID"})
        }

        let isProductIdPresent = await ProductModel.findOne({_id:productId});
        if(!isProductIdPresent){
            return res.status(400).send({status:false,msg:"Product id is not present"})
        }

        return res.status(200).send({status:true,message:"Success",data:isProductIdPresent})


    }
    catch(err){
        return res.status(500).send({msg:err.message})
    }
}

const deleteProduct = async function(req,res){
    try {
        let productId = req.params.productId

        if (!validator.isValidObjectId(productId)) {
            return res.status(400).send({status:false,message:"Product Id is not correct"})
           }

           let isProductIdPresent = await ProductModel.findOne({_id:productId,isDeleted:false});

           if(!isProductIdPresent){
            return res.status(400).send({status:false,msg:"Product Id is already deleted"})
           }

           let nowDeleted = await ProductModel.findByIdAndUpdate(productId,{isDeleted:true},{new:true})

           return res.status(200).send({status:false,msg:"success" ,data:nowDeleted})

    } catch (error) {
        return res.status(500).send({msg:error.message})
    }
}

module.exports.deleteProduct = deleteProduct
module.exports.getProductById = getProductById;
module.exports.createProduct = createProduct;