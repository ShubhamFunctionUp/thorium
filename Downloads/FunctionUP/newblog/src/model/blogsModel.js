const mongoose = require('mongoose');

// { title: {mandatory}, body: {mandatory}, authorId: {mandatory, refs to author model}, tags: {array of string}, 
// category: {string, mandatory, examples: [technology, entertainment, life style, food, fashion]}, 
// subcategory: {array of string, examples[technology-[web development, mobile development, AI, ML etc]] }, 
// createdAt, updatedAt, deletedAt: {when the document is deleted}, 
// isDeleted: {boolean, default: false}, publishedAt: {when the blog is published}, isPublished: {boolean, default: false}}

const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    authorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Author'
    },
    tags:{
        type:[String],
        required:true
    },
    category:{
        type:String,
        required:true
    },
    subcategory:{
        type:[String]
    },
    deletedAt:{
        type:String,
        default:""
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    PublishedAt:{
        type:String,
        default:""
    },
    isPublished:{
        type:Boolean,
        default:false
    }



},{timestamps:true})


module.exports = mongoose.model('Blog',blogSchema);