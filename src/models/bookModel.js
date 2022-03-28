const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const cd = new Date();
const bookSchema = new mongoose.Schema({

    title: {type:String, required:true, unique:true, trim:true},
    excerpt: {type:String, required:true}, 
    userId: {type:ObjectId, ref:'User' , required:true},
    ISBN: {type:String, required:true, unique:true},
    category: {type:String, required:true},
    subcategory:[ {type:String, required:true}],
    reviews: {type:Number, default: 0},
    deletedAt: {type:Date, default:""}, 
    isDeleted: {type:Boolean, default: false},
    releasedAt: {type:Date, default:""},


},{timestamps:true})

module.exports = mongoose.model('Book',bookSchema)