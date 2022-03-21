const mongoose = require('mongoose');

// { name: {mandatory}, email: {mandatory, valid email, unique},
//  mobile: {mandatory, valid mobile number, unique}, collegeId: {ObjectId, ref to college model, isDeleted: {boolean, default: false}}

const internModel = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        // Validation is required
        unique:true
    },
    mobile:{
        type:String,
        unique:true,
        // Validation is required
        required:true
    },
    collegeId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'College'
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},{timeStamp:true})

module.exports = mongoose.model('Intern',internModel)