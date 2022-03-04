const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    authorName:{
        type:String
    },
    rating:{
        type:Number
    }
},{timestamps:true})

module.exports = mongoose.model('author',authorSchema);