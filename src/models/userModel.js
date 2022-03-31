const mongoose = require('mongoose');

// title: {string, mandatory, enum[Mr, Mrs, Miss]},
//   name: {string, mandatory},
//   phone: {string, mandatory, unique},
//   email: {string, mandatory, valid email, unique}, 
//   password: {string, mandatory, minLen 8, maxLen 15},
//   address: {
//     street: {string},
//     city: {string},
//     pincode: {string}
//   },
//   createdAt: {timestamp},
//   updatedAt: {timestamp}
// }


// "       Hello"

const UserSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        enum:["Mr","Mrs","Miss"]
    },
    name:{
        type:String,
        required:true,
        trim:true
    },
    phone:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        min:8,
        max:15,
        trim:true
    },
    address:{
        street:{
            type:String,
            required:true,
            trim:true
        },
        city:{
            type:String,
            required:true,
            trim:true
        },
        pincode:{
            type:String,
            required:true,
            trim:true
        },
    },
    isDeleted:{
        type:Boolean,
        default:false
    }

},{timestamps:true})

module.exports = mongoose.model('User',UserSchema);