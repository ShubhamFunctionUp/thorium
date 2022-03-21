const mongoose = require('mongoose');

// { name: { mandatory, unique, example iith}, fullName: {mandatory, example `Indian Institute of Technology, Hyderabad`}, 
// logoLink: {mandatory}, isDeleted: {boolean, default: false} }

const collegeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        lowerCase:true
    },
    fullName:{
        type:String,
        required:true
    },
    link:{
        type:String,
        required:true
    },
      
    // },
    isDeleted:{
        type:Boolean,
        default:false
    }

},{timeStamp:true})

module.exports = mongoose.model('College',collegeSchema);