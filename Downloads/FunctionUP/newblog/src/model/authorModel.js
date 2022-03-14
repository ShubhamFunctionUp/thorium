const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    // { fname: { mandatory}, lname: {mandatory}, title: {mandatory, enum[Mr, Mrs, Miss]}, email: {mandatory, valid email, unique}, password: {mandatory} }

    fName:{
        type:String,
        required:true
    },
    lName:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true,
        enum:["Mr","MRS","MISS"]
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }


},{timestamps:true})


module.exports = mongoose.model('Author',authorSchema);