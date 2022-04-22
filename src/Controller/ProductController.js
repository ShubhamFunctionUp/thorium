const productModel = require('../Model/ProductModel')
const awsS3 = require('../Aws/aws-s3')
const mongoose = require('mongoose')

// <--------------- VALIDATION ------------------------------------------------------->
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

   const isValidfiles = function (files) {
   if (files && files.length > 0)
        return true
 }



//--------------------------------------------CreateProduct----------------------------


const CreateProduct = async function (req, res) {

    try {
        let files = req.files
        let requestBody = req.body

        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, msg: "No input provided" })
        }

        let { title, description, price, currencyId, currencyFormat, availableSizes } = requestBody

        if (!isValid(title)) {
            return res.status(400).send({ status: false, msg: "title is required" })
        }

        const istitleUsed = await productModel.findOne({ title: title })

        if (istitleUsed) {
            return res.status(400).send({ status: false, msg: "title should be unique" })

        }

        if (!isValid(description)) {
            return res.status(400).send({ status: false, msg: "description is required" })
        }

        if (!isValid(price)) {
            return res.status(400).send({ status: false, msg: "price is required" })
        }

        if (!isValid(currencyId)) {
            return res.status(400).send({ status: false, msg: "currencyId is required" })
        }

        if (currencyId != "INR") {
            return res.status(400).send({ status: false, Message: "currency should be INR" })
        }

        if (!isValid(currencyFormat)) {
            return res.status(400).send({ status: false, msg: "currency format is required" })
        }

        if (currencyFormat != "₹") {
            return res.status(400).send({ status: false, Message: "currency format should be ₹ " })
        }

        // if (typeof(installments)!=Number) {
        //     return res.status(400).send({ status: false, msg: "installments should be in Number only" })
        // }



        if (availableSizes) {

            if (availableSizes.length === 0) {
                return res.status(400).send({ status: false, msg: "Input product size" })
            }

            let array = []

            //converting string into array-
            let SavailableSizes = availableSizes.split(",")

            for (let i = 0; i < availableSizes.split(",").length; i++) {

                array.push(SavailableSizes[i].toUpperCase())

                if (!(["S", "XS", "M", "X", "L", "XXL", "XL"].includes(array[i]))) {

                    return res.status(400).send({ status: false, message: "Provide a valid size" })
                }

            }

            requestBody.availableSizes = array
        }


        if (!isValidfiles(files)) {
            return res.status(400).send({ status: false, message: "file upload should be valid should not be empty" })
        }


        //uploading product image-
        requestBody.productImage = await awsS3.uploadFile(files[0])

        //creating product-
        let Product = await productModel.create(requestBody)
        return res.status(201).send({ status: true, message: 'Product created successfully', data: Product })

    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}







//--------------------------------------------------GetProductByQuery---------------------------------

const getProducts = async function (req, res) {
    let requestQuery = req.query;
    try {

        let obj = {
            isDeleted: false
        }

        let availableSizes = requestQuery.availableSizes;

        if (availableSizes) {
            if (!isValid(availableSizes) && availableSizes.length === 0) {
                return res.status(400).send({ status: false, msg: "Please enter size" })
            } else {
                obj.availableSizes = { $in: availableSizes.split(",") };   // {$in:[M,XL,XLL]}
            }
        }

        let name = requestQuery.name;
        if (name) {
            if (!isValid(name)) {
                return res.status(400).send({ status: false, mesage: "please enter valid name" })
            } else {
                //    $regex is given by mongodb it will return whatever data pattern
                obj.title = { $regex: name };   //j.... m ....
            }
        }

        let priceGreaterThan = req.query.priceGreaterThan;
        if (priceGreaterThan) {
            if (!isValid(priceGreaterThan)) {
                return res.status(400).send({ status: false, message: "Please enter price" })
            } else {
                obj.price = { $gte: priceGreaterThan }
            }
        }

        let priceLessThan = req.query.priceLessThan;
        if (priceLessThan) {
            if (!isValid(priceLessThan)) {
                return res.status(400).send({ status: false, msg: "Please enter the pricelessthan" })
            } else {
                obj.price = { $lte: priceLessThan }
            }
        }

        if (priceGreaterThan && priceLessThan) {
            if (!isValid(priceLessThan)) {
                return res.status(400).send({ status: false, message: "Please enter price less than" })
            }
            if (!isValid(priceGreaterThan)) {
                return res.status(400).send({ status: false, message: "Please enter greater price" })

            }

            obj.price = { $lte: priceLessThan, $gte: priceGreaterThan }
        }

        let priceSort = requestQuery.priceSort;
        if (priceSort) {
            if (priceSort === "lessToMore") {
                priceSort = 1;
            } else if (priceSort === "moreToLess") {
                priceSort = -1;
            }
        }
        console.log(obj);
        let filterProduct = await productModel.find(obj).sort({ price: priceSort })

        if (filterProduct.length == 0) {
            return res.status(400).send({ status: true, message: "No product Found" });
        }

        return res.status(200).send({ status: true, message: "Products you want", data: filterProduct })


    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}





//-------------------------------------------------------GetProductById---------------------------------

const getProductById = async function (req, res) {
    try {
        let productId = req.params.productId


        if (!isValidObjectId(productId)) {
            return res.status(400).send({ status: false, msg: "input productId in correct format" })
        }

        const getProduct = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!getProduct) {
            return res.status(400).send({ status: false, msg: "product does not exist" })
        }

        res.status(200).send({ status: true, msg: 'sucess', data: getProduct })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}







//---------------------------------------------------------UpdateProduct-------------------------


const updateProductById = async function (req, res) {
    try {
        const data = req.body
        const productId = req.params.productId


        if (!isValidObjectId(productId)) {
            return res.status(400).send({ status: false, msg: "input productId in correct format" })
        }

        const checkProductId = await productModel.findOne({ _id: productId, isDeleted: false })

        if (!checkProductId) {
            return res.status(404).send({ status: false, msg: "Invalid product id" })
        }

        const { title, description, price, currencyId, currencyFormat, isFreeShipping, style, availableSizes, installments } = data;

        const updateProductInfo = {}

        const files = req.files

        if (isValidfiles(files)) {
            const productImage = await awsS3.uploadFile(files[0])
            updateProductInfo.productImage = productImage
        }
        if (isValid(title)) {
            const isTitleAlreadyUsed = await productModel.findOne({ title: title });
            if (isTitleAlreadyUsed) {
                return res.status(400).send({ status: false, msg: "title already exist" })
            }
            updateProductInfo.title = title
        }
        if (isValid(description)) {
            updateProductInfo.description = description
        }

        if (isValid(price)) {
            updateProductInfo.price = price
        }

        if (isValid(currencyId)) {
            updateProductInfo.currencyId = currencyId
        }

        if (isValid(isFreeShipping)) {
            updateProductInfo.isFreeShipping = isFreeShipping
        }

        if (isValid(currencyFormat)) {
            updateProductInfo.currencyFormat = currencyFormat
        }

        if (isValid(style)) {
            updateProductInfo.style = style
        }


        if (availableSizes) {

            if (availableSizes.length === 0) {
                return res.status(400).send({ status: false, msg: "Input product size" })
            }

            let array = []

            //converting string into array-
            let SavailableSizes = availableSizes.split(",")

            for (let i = 0; i < availableSizes.split(",").length; i++) {

                array.push(SavailableSizes[i].toUpperCase())

                if (!(["S", "XS", "M", "X", "L", "XXL", "XL"].includes(array[i]))) {

                    return res.status(400).send({ status: false, message: "Provide a valid size" })
                }

            }

            updateProductInfo.availableSizes = array
        }

        if (isValid(installments)) {
            updateProductInfo.installments = installments
        }


        const updatedProduct = await productModel.findOneAndUpdate({ _id: productId }, updateProductInfo, { new: true })

        return res.status(200).send({ status: true, message: 'Success', data: updatedProduct });

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}







//---------------------------------------------------------DeleteProduct--------------------------------


const deleteProduct = async function (req, res) {
    try {
        let productId = req.params.productId

        if (!isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: "Product Id is not correct" })
        }

        let isProductIdDeleted = await productModel.findOne({ _id: productId, isDeleted: true });

        if (isProductIdDeleted) {
            return res.status(400).send({ status: false, msg: "Product is already deleted" })
        }

        let isProductIdPresent = await productModel.findOne({ _id: productId, isDeleted: false });

        if (!isProductIdPresent) {
            return res.status(400).send({ status: false, msg: "No product exist with this product Id" })
        }


        let nowDeleted = await productModel.findByIdAndUpdate({ _id: productId }, { isDeleted: true, deletedAt: new Date() }, { new: true })

        return res.status(200).send({ status: false, msg: "success", data: nowDeleted })

    } catch (error) {
        return res.status(500).send({ msg: error.message })
    }
}




module.exports = {
    CreateProduct,
    getProducts,
    getProductById,
    updateProductById,
    deleteProduct
}













// const mongoose = require('mongoose')
// const ProductModel = require('../Model/ProductModel')
// const aws = require('../Aws/aws-s3')

// const isValid = function (value) {
//     if (typeof value == undefined || value == null) return false;
//     if (typeof value === "string" && value.trim().length === 0) return false;
//     return true;
//   };

//   const isBodyRequestValid = function (requestBody) {
//     return Object.keys(requestBody).length > 0
//   }

//   let isValidObjectId = function (objectId){
//     return mongoose.Types.ObjectId.isValid(objectId)
// }

// const isavailableSizesValid = function (availableSizes) {
//     return ["S", "XS","M","X", "L","XXL", "XL"].indexOf(availableSizes) !== -1
//   }

//   const isvalidNumber = function (value) {
//     if (typeof value === "Number") {
//       return true;
//     }
// }

// const isValidCurrencyFormat = function (currencyFormat) {
//     return ['₹'].indexOf(currencyFormat) !== -1
// }

// const isValidfiles = function (files) {
//     if (files && files.length > 0)
//         return true
// }

// // if (currencyFormat != "₹") {
// //     return res.status(400).send({ status: false, Message: "currency format should be ₹ " })
// // }


// const CreateProduct = async function (req, res){
//     try{

//         let files = req.files
//         let requestBody = req.body
       
//         if(!isBodyRequestValid(requestBody)){
//             return res.status(400).send({status:false,msg:"No input provided"})
//         }

//         let {title,description,price,currencyId,currencyFormat,productImage,availableSizes,installments} = requestBody
//         if(!isValid(title)){
//             return res.status(400).send({status:false,msg:"title is required"})
//         }

//         const istitleUsed = await ProductModel.findOne({title})
//         if (istitleUsed) {
//             return  res.status(400).send({status:false, msg:"title should be unique"})
            
//         }

//         if(!isValid(description)){
//             return res.status(400).send({status:false,msg:"description is required"})
//         }

//         if(!isValid(price)){
//             return res.status(400).send({status:false,msg:"price is required"})
//         }

//         // if(!/^\d{0,8}(\.\d{1,2})?$/(price)){
//         //     return res.status(400).send({status:false,msg:"price should be  valid"})
//         // }

//         if(!isValid(currencyId)){
//             return res.status(400).send({status:false,msg:"currencyId is required"})
//         }

//         if(!isValid(currencyFormat)){
//             return res.status(400).send({status:false,msg:"currencyFormat is required"})
//         }

//         if(!isValidCurrencyFormat(currencyFormat)){
//             return res.status(400).send({status:false,msg:"currencyFormat should be valid"})
//         }

//         if(!isValid(installments)){
//             return res.status(400).send({status:false,msg:"installments should be in Number only"})
//         }


//         requestBody.productImage = await aws.uploadFile(files[0])
//         console.log(productImage)

//         if(!isavailableSizesValid(availableSizes)){
//             return res.status(400).send({status:false,msg:"availableSizes should be S, XS,M,X, L,XXL, XL"})
//         }
     
//         let Product = await ProductModel.create(requestBody)
//      return res.status(201).send({ status: true, message: 'Product created successfully', data: Product })

//     }
//     catch(error){
//         return res.status(500).send({status:false,msg:error.msg})
//     }
// }



// const getProducts = async function(req,res){
//     let requestQuery = req.query;
//     try {
        
//         let obj = {
//             isDeleted:false
//         }

//         let availableSizes = requestQuery.availableSizes;
//         if(availableSizes){
//         if(!isValid(availableSizes) && availableSizes.length===0){
//             return res.status(400).send({status:false,msg:"Please enter size"})
//         }else{
//             obj.availableSizes ={$in:availableSizes};
//         }
//     }

//         let name = requestQuery.name;
//         if(name){
//         if (!isValid(name)) {
//             return res.status(400).send({status:false,mesage:"please enter valid name"})
//         } else {
//             //    $regex is given by mongodb it will return whatever data pattern
//             obj.title = {$regex:name};
//          }
//         }
    
//         let priceGreaterThan = req.query.priceGreaterThan;
//         if(priceGreaterThan){
//             if(!validator.isValid(priceGreaterThan)){
//                 return res.status(400).send({status:false,message:"Please enter price"})
//             }else{
//                 obj.price = {$gte:priceGreaterThan}
//             }
//         }

//         let priceLessThan = req.query.priceLessThan;
//         if(priceLessThan){
//             if(!validator.isValid(priceLessThan)){
//                 return res.status(400).send({status:false,msg:"Please enter the pricelessthan"})
//             }else{
//                 obj.price = {$lte:priceLessThan}
//             }
//         }

//         if(priceGreaterThan && priceLessThan){
//             if(!validator.isValid(priceLessThan)){
//                 return res.status(400).send({status:false,message:"Please enter price less than"})
//             }
//             if(!validator.isValid(priceGreaterThan)){
//                 return res.status(400).send({status:false,message:"Please enter greater price"})
           
//             }

//             obj.price = {$lte:priceLessThan,$gte:priceGreaterThan}
//         }

//         let priceSort = requestQuery.priceSort;
//         if(priceSort){
//         if(priceSort==="lessToMore"){
//             priceSort = 1;
//         }else if(priceSort==="moreToLess"){
//             priceSort = -1;
//         }
//     }
//         let filterProduct = await ProductModel.find(obj).sort({price:priceSort})

//         if(filterProduct.length==0){
//             return res.status(400).send({status:true,message:"No product Found"});
//         }

//         return res.status(200).send({status:true,message:"Products you want",data:filterProduct})
        

//     } catch (error) {
//         return res.status(500).send({status:false,msg:error.message})
//     }
// }

// const getProductById = async function (req, res) {
//     try {
//         let productId = req.params.productId

//         const getProduct = await ProductModel.findOne({ _id: productId, isDeleted: false })
//         if (!getProduct) {
//             return res.status(400).send({ status: false, msg: "product does not exist" })
//         }
//         res.status(200).send({ status: true, msg: 'sucess', data: getProduct })
//     }
//     catch (err) {
//         res.status(500).send({ status: false, Message: err.message })
//     }
// }

// const updateProductById = async function (req, res) {
//     try {
//         const data = req.body
//         const productId = req.params.productId

//         const checkProductId = await ProductModel.findOne({ _id: productId, isDeleted: false })

//         if (!checkProductId) {
//             return res.status(404).send({ status: false, msg: "Invalid product id" })
//         }
//         const { title, description, price, currencyId, currencyFormat, isFreeShipping, style, availableSizes, installments,productImage } = data;

//         const updateProductInfo = {}

//         const files = req.files

//         if (isValidfiles(files)) {
//             const productImage = await aws.uploadFile(files[0])
//             updateProductInfo.productImage = productImage
//         }
//         if (isValid(title)) {
//             const isTitleAlreadyUsed = await ProductModel.findOne({ title: title });
//             if (isTitleAlreadyUsed) {
//                 return res.status(400).send({ status: false, msg: "title already exist"  })
//             }
//             updateProductInfo.title = title
//         }
//         if (isValid(description)) {
//             updateProductInfo.description = description
//         }

//         if (isValid(price)) {
//             updateProductInfo.price = price
//         }

//         if (isValid(currencyId)) {
//             updateProductInfo.currencyId = currencyId
//         }

//         if (isValid(isFreeShipping)) {
//             updateProductInfo.isFreeShipping = isFreeShipping
//         }

//         if (isValid(currencyFormat)) {
//             updateProductInfo.currencyFormat = currencyFormat
//         }

//         if (isValid(style)) {
//             updateProductInfo.style = style
//         }
//         if (availableSizes) {

//             if (availableSizes.length === 0) {
//                 return res.status(400).send({ status: false, msg: "Input product size" })
//             }
//            // console.log(typeof(availableSizes.split(" ")));
              
//             let array = []
//          //   let newsize = availableSizes.split(" ").length
//            let SavailableSizes= availableSizes.split(",")
//            // console.log(newsize)
//             for (let i = 0; i < availableSizes.split(",").length; i++) {
//                // console.log(availableSizes[i])
//                 array.push(SavailableSizes[i].toUpperCase())
//                 if (!(["S", "XS", "M", "X", "L", "XXL", "XL"].includes(array[i]))) {

//                     return res.status(400).send({ status: false, message: "Provide a valid size" })
//                 }

//             }
//            // updateProductInfo.$addToSet = { availableSizes: array }
//            updateProductInfo.availableSizes=array
//         }

//         if (isValid(installments)) {
//             updateProductInfo.installments = installments
//         }



//         const updatedProduct = await ProductModel.findOneAndUpdate({ _id: productId }, updateProductInfo, { new: true })

//         return res.status(200).send({ status: true, message: 'Success', data: updatedProduct });

//     } 
//     catch (error) {
//         return res.status(500).send({ status: false, message: error.message });
//     }
// }

// const deleteProduct = async function(req,res){
//     try {
//         let productId = req.params.productId

//         if (!isValidObjectId(productId)) {
//             return res.status(400).send({status:false,message:"Product Id is not correct"})
//            }

//            let isProductIdDeleted = await ProductModel.findOne({_id:productId,isDeleted:true});

//            if(isProductIdDeleted){
//             return res.status(400).send({status:false,msg:"Product Id is already deleted"})
//            } 

//            let isProductIdPresent = await ProductModel.findOne({_id:productId,isDeleted:false});

//            if(!isProductIdPresent){
//             return res.status(400).send({status:false,msg:"Product Id is not present"})
//            }

          

//            let nowDeleted = await ProductModel.findByIdAndUpdate({_id:productId},{isDeleted:true,deletedAt:new Date()},{new:true})

//            return res.status(200).send({status:false,msg:"Product deleted successfully" ,data:nowDeleted})

//     } catch (error) {
//         return res.status(500).send({msg:error.message})
//     }

// }

// module.exports.CreateProduct=CreateProduct
// module.exports.getProductById=getProductById
// module.exports.updateProductById=updateProductById
// module.exports.deleteProduct=deleteProduct
// module.exports.getProducts=getProducts