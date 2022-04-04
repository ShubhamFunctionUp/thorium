const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({
    urlCode:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    longUrl:{
        type:String,
        required:true,
        // Check valid URL
    },
    shortUrl:{
        type:String,
        required:true,
        unique:true
    }
},{timestamps:true})

module.exports = mongoose.model('Url',UrlSchema)