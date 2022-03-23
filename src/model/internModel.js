const mongoose = require('mongoose');

// { name: {mandatory}, email: {mandatory, valid email, unique},
//  mobile: {mandatory, valid mobile number, unique}, collegeId: {ObjectId, ref to college model, isDeleted: {boolean, default: false}}
// let stringRegex = "^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[456789]\d{9}|(\d[ -]?){10}\d$";


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
        type:String ,
        unique:true,
        // Validation is required
        required:true,
        match:[/^[6-9]\d{9}$/]
    },
    collegeId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'College',
        required:[true,"college id is required"]
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},{timeStamp:true})

module.exports = mongoose.model('Intern',internModel)