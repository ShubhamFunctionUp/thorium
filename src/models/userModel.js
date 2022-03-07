const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:true
    },
    balance:{
        type:Number
    },
    address:{
        type:String
    },
    age:{
        type:Number
    },
    gender:{
        type:String,
        enum:["Male","Female","Other"]
    },
    isFreeAppUser:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

module.exports= mongoose.model('User',userSchema);
