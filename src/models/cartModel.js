const mongoose = require('mongoose');
// userId: {ObjectId, refs to User, mandatory, unique},
//   items: [{
//     productId: {ObjectId, refs to Product model, mandatory},
//     quantity: {number, mandatory, min 1}
//   }],
//   totalPrice: {number, mandatory, comment: "Holds total price of all the items in the cart"},
//   totalItems: {number, mandatory, comment: "Holds total number of items in the cart"},
const CartSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    items:{
        type:[
            {
                productId:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:'Product',
                    required:true
                },
                quantity:{
                    type:Number,
                    required:true,
                    min:1,
                    default:1
                }
            }
        ]
    },
    totalPrice:{
        type:Number,
        required:true
    },
    totalItems : {
        type:Number,
        required:true
    }
},{timestamps:true})

module.exports = mongoose.model('Cart',CartSchema);