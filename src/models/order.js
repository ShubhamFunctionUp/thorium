const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    productId :{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
    },
    amount:{
        type:Number
    },
    isFreeAppUser:{
        type:Boolean
    },
    date:{
        type:String
    }
},{timestamps:true})


module.exports = mongoose.model('Order',orderSchema);