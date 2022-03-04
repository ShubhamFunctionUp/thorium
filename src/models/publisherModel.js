const mongoose = require('mongoose');

const publisherSchema = new mongoose.Schema({
    publisherName:{
        type:String
    }
},{timestamps:true})

module.exports = mongoose.model('publisher',publisherSchema);