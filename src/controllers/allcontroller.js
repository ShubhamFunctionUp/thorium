const bookModel  = require('../models/bookModel');
const authorModel  = require('../models/authorModel');
const publisherModel  = require('../models/publisherModel');

const createAuthor = async function(req,res){
    let authorDetails = req.body;
    let savedData =await authorModel.create(authorDetails);
    res.send({msg:savedData})
}

const createPublisher = async function(req,res){
    let publisherDetails = req.body;
    let savedData =await publisherModel.create(publisherDetails)
    res.send({msg:savedData})
}

const createBook = async function(req,res){
    let bookDetails = req.body;
    let savedData = await bookModel.create(bookDetails);
    res.send({msg:savedData})
}

const allBooks = async function(req,res){
    let pen =await bookModel.find({publisher}).populate('author publisher');
    res.send({msg:pen})
}
module.exports.allBooks=allBooks
module.exports.createBook = createBook;
module.exports.createPublisher = createPublisher;
module.exports.createAuthor = createAuthor;