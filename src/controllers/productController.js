const productModel = require('../models/product');

const createProduct = async function(req,res){
    let data = req.body;
    let productData =await productModel.create(data);
    res.send({msg:productData})
}

module.exports.createProduct = createProduct