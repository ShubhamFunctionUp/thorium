const bookModel = require('../models/bookModel');
const BookModel = require('../models/bookModel');
const reviewModel = require('../models/reviewModel');


const createReview = async function (req, res) {
    let bookId = req.params.bookId;
    if (bookId == "" || typeof(bookId)==undefined || typeof(bookId)==null) {
        return res.send({
            msg: "Please pass bookId in url"
        })
    }
    let isBookIdPresent = await bookModel.findOne({
        _id: bookId,
        isDeleted: false
    });
    if (isBookIdPresent == null) {
        return res.send({
            msg: "Not book is present with this ID"
        });
    }
    let data = req.body;

    if (Object.keys(data).length == 0) {
        return res.send({
            msg: "Please enter the value"
        });
    }
    let bookCount = await bookModel.updateOne({
        _id: bookId
    }, {
        $inc: {
            reviews: 1
        }
    })
    let reviewedAt =Date.now();
    req.body.reviewedAt = reviewedAt;
    let createEntries = await reviewModel.create(data);

    return res.send({
        msg: createEntries
    });

}

const deletedReview = async function (req, res) {
    let bookId = req.params.bookId;
    let reviewId = req.params.reviewId;
    // console.log(reviewId);
    try {
        if (bookId == "") {
            return res.status(400).send({
                status: false,
                message: "No bookId is present"
            });
        }

        if (reviewId == "") {
            return res.status(400).send({
                status: false,
                message: "No reviewId is present"
            });
        }

        let isReviewIdPresent = await reviewModel.findOne({
            _id: reviewId,
            isDeleted: false
        });
        if (isReviewIdPresent == null) {
            return res.status(400).send({
                status: false,
                msg: "No review is present"
            })
        }

        let isBookIdPresent = await bookModel.findOne({
            _id: bookId,
            isDeleted: false
        });
        if (isBookIdPresent == null) {
            return res.status(400).send({
                status: false,
                msg: "No book is present"
            })
        }

        let bookCount = await bookModel.updateOne({
            _id: bookId
        }, {
            $inc: {
                reviews: -1
            }
        })
        let deleteReview = await reviewModel.findByIdAndUpdate(reviewId, {
            isDeleted: true
        }, {
            new: true
        })

        return res.status(202).send({
            status: true,
            message: "Success",
            data:deleteReview
        });
    } catch (err) {
        return res.status(500).send({
            msg: err.message
        })
    }

}

module.exports.deletedReview = deletedReview;
module.exports.createReview = createReview;