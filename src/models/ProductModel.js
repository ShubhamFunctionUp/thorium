const mongoose = require('mongoose')
const ProductSchema = new mongoose.Schema(
    {
        title:{
            type:String,
            require:true,
            unique:true
        },
        description:{
            type:String,
            require:true
        },
        price: {
            type:Number, 
            require:true
        },
        currencyId:{
            type:String,
            require:true
        },
        currencyFormat:{
            type:String,
            require:true
        },
        isFreeShipping:{
            tyoe:Boolean,
            default:false
        },
        productImage:{
            type:String,
            require:true
        },
        style:{
            type:String
        },
        availableSizes:{
            type:[String],
            enum:["S", "XS","M","X", "L","XXL", "XL"]
        },
        deletedAt:{
            type:Date
        },
        isDeleted:{
            type:Boolean,
            default:false
        }

 },{timestamps:true}
);

module.exports = mongoose.model('Product',ProductSchema)