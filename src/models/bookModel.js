const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    bookName:{
        type:String
    },
    publisher:{
        type:mongoose.Types.ObjectId,
        ref:'publisher'
    },
    author:{
        type:mongoose.Types.ObjectId,
        ref:'author'
    },
    isHardCover:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

module.exports = mongoose.model('book',bookSchema);