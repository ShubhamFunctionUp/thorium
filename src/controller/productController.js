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


// <------------------------- Creating Product-------------------------------------------->
    
  const CreateProduct = async function (req, res){
            try{
        
                
                let requestBody = req.body
                let files = req.files
                if(!validator.isValidRequestBody(requestBody) && !validator.isValidRequestBody(files)){
                    return res.status(400).send({status:false,msg:"No input provided"})
                }
        
                let {title,description,price,currencyId,currencyFormat,productImage,availableSizes,installments} = requestBody
                if(!validator.isValid(title)){
                    return res.status(400).send({status:false,msg:"title is required"})
                }
        
                const istitleUsed = await ProductModel.findOne({title})
                if (istitleUsed) {
                    return  res.status(400).send({status:false, msg:"title should be unique"})
                    
                }
        
                if(!validator.isValid(description)){
                    return res.status(400).send({status:false,msg:"description is required"})
                }
        
                if(!validator.isValid(price)){
                    return res.status(400).send({status:false,msg:"price is required"})
                }
        
                // if(!/^\d{0,8}(\.\d{1,2})?$/(price)){
                //     return res.status(400).send({status:false,msg:"price should be  valid"})
                // }
        
                if(!validator.isValid(currencyId)){
                    return res.status(400).send({status:false,msg:"currencyId is required"})
                }
        
                if(!validator.isValid(currencyFormat)){
                    return res.status(400).send({status:false,msg:"currencyFormat is required"})
                }
        
                if(!validator.isValidCurrencyFormat(currencyFormat)){
                    return res.status(400).send({status:false,msg:"currencyFormat should be valid"})
                }
        
                if(!validator.isValid(installments)){
                    return res.status(400).send({status:false,msg:"installments should be in Number only"})
                }
        
        
                requestBody.productImage = await awsFile.uploadFile(files[0])
                console.log(productImage)
        
                // if (!["Mr", "Mrs", "Miss"].includes(title)) {
                //  return res.status(400).send({status: false,message: "enter valid title between Mr, Mrs, Miss",});
                // }
             
                let Product = await ProductModel.create(requestBody)
             return res.status(201).send({ status: true, message: 'Product created successfully', data: Product })
        
            }
            catch(error){
                return res.status(500).send({status:false,msg:error.msg})
            }
        }
        
      
// <----------------------------  GET Product---------------------------------------------------------->


const getProducts = async function(req,res){
    let requestQuery = req.query;
    let obj = {};
    if(Object.keys(requestQuery).length===0){
        let allUndeletedProduct = await ProductModel.find({isDeleted:false});
        return res.status(200).send({status:true,msg:"Success",data:allUndeletedProduct})
    }else{
        // Size ,Product Name substring ,price
        let {size,ProductName,priceGreaterThan,priceLessThan}  = req.query;
        if (validator.isValid(size)) {
            obj.size = size
        }
        // if (validator.isValid(ProductName) ){
        //     obj.ProductName
        // }
        

        if(validator.isValid(priceGreaterThan)){
            let calculate = {
                price:{$gt:parseInt(priceGreaterThan)}
            }
            obj.price = calculate
        }

        if(validator.isValid(priceLessThan)){
            let calculate = {
                price:{$lt:priceLessThan}
            }
            obj.priceL = calculate
        }

        let findDetails = await ProductModel.find({...obj});



        return res.status(400).send({status:false,message:"Success",data:findDetails})

    }

}


// <---------------------------------   Get Product By ID--------------------------------------------->

let getProductById = async function(req,res){
    let productId = req.params.productId;

    try{
        if(!validator.isValidObjectId(productId)){
            return res.status(400).send({status:false,message:"Not a Valid Object ID"})
        }

        let isProductIdPresent = await ProductModel.findOne({_id:productId,isDeleted:false});
        if(!isProductIdPresent){
            return res.status(400).send({status:false,msg:"Product id is not present"})
        }

        return res.status(200).send({status:true,message:"Success",data:isProductIdPresent})

    }
    catch(err){
        return res.status(500).send({msg:err.message})
    }
}

// <--------------------------- Delete Product  ------------------------------------------------------>

const deleteProduct = async function(req,res){
    try {
        let productId = req.params.productId

        if (!validator.validator.isValidObjectId(productId)) {
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

module.exports.getProducts=getProducts
module.exports.deleteProduct = deleteProduct
module.exports.getProductById = getProductById;
module.exports.CreateProduct = CreateProduct;