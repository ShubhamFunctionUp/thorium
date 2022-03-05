const bookModel = require('../models/bookModel');
const authorModel = require('../models/authorModel');
const publisherModel = require('../models/publisherModel');
const { updateOne, find } = require('../models/bookModel');

const createAuthor = async function (req, res) {
    let authorDetails = req.body;
    let savedData = await authorModel.create(authorDetails);
    res.send({ msg: savedData })
}

const createPublisher = async function (req, res) {
    let publisherDetails = req.body;
    let savedData = await publisherModel.create(publisherDetails)
    res.send({ msg: savedData })
}

const createBook = async function (req, res) {
    let bookDetails = req.body;
    let savedData = await bookModel.create(bookDetails);
    res.send({ msg: savedData })
}

const allBooks = async function (req, res) {
    // 5A
    let hardCoverPublihers = await publisherModel.find({
        name: { $in: ["Penguin", "HarperCollins"] }
    })
    let publisherID = hardCoverPublihers.map((p) => (p._id));
    await bookModel.updateMany(
        { publisherID: { $in: publisherID } },
        { isHardCover: true }
    );

    let highRatedAuthors = await authorModel.find({ rating: { $gt: 3.5 } });
    let authorIds = highRatedAuthors.map((a) => a._id);

    await bookModel.updateMany(
        { author: { $in: authorIds } },
        { $inc: { price: 10 } }
    );

    let updatedBooks = await bookModel.find();
    res.send({ updatedBookCollection: updatedBooks });
};


module.exports.allBooks = allBooks
module.exports.createBook = createBook;
module.exports.createPublisher = createPublisher;
module.exports.createAuthor = createAuthor;