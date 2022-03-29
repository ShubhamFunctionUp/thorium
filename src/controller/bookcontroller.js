const {
    findOne,
    findById
} = require('../models/bookModel');
const bookModel = require('../models/bookModel');
const reviewModel = require('../models/reviewModel');

// most of the validation is required in post and put api
// in remaining less api is used


// -----------------CreateBook-----------------
const createBook = async function (req, res) {
    let data = req.body;
    if (Object.keys(data) == 0) {
        return res.send({
            status: false,
            msg: "Please insert data"
        });
    }

    let {
        title
    } = data;
    let isBookPresent = await bookModel.findOne({
        title: title
    });
    if (isBookPresent != null) {
        return res.send({
            msg: "book is already present"
        })
    }

    const cd = new Date();
    const releasedAt = cd;
    // console.log(releasedAt);
    data.releasedAt = releasedAt;

    let entryCreated = await bookModel.create(data);
    return res.send({
        status: true,
        data: entryCreated
    });
}

// -------------------------Get Book--------------------------
const findBook = async function (req, res) {
    let data = req.query;
    if (Object.keys(data).length === 0) {
        let isNotDeleted = await bookModel.find({
            isDeleted: false
        }).select({
            book_id: 1,
            title: 1,
            excerpt: 1,
            userId: 1,
            category: 1,
            releasedAt: 1,
            reviews: 1
        })
        if (isNotDeleted.length === 0) {
            return res.status(404).send({
                msg: "not data is present"
            });
        }
        return res.status(200).send({
            msg: isNotDeleted
        });
    } else {

        let filter = {
            ...data
        }
        let findFilterBook = await bookModel.find(filter).sort({
            title: 1
        });

        return res.status(200).send({
            msg: findFilterBook
        });
    }
}

// -----------------------------------Get Element By ID.......................................
const getBookById = async function (req, res) {
    let bookparameter = req.params.bookId;
    if (bookparameter == null || bookparameter == undefined) {
        return res.send({
            msg: "No parameter is present"
        })
    }

    let parameterIsPresent = await bookModel.findById(bookparameter)
    if (parameterIsPresent == null) {
        return res.send({
            msg: "No book is present with this ID"
        });
    }

    let copyOfBook = JSON.parse(JSON.stringify(parameterIsPresent));
    // copyOfBook.reviews = 0;
    let reviews = await reviewModel.find({
        bookId: bookparameter,
        isDeleted: false
    }).select({createdAt:0,updatedAt:0});
    if (reviews.length > 0) {
        copyOfBook.reviewsData = reviews;
    }
    // copyOfBook.reviewsData = [];
    return res.send({
        msg: copyOfBook
    })

}

const updateBook = async function (req, res) {
    let bookParameter = req.params.bookId;
    if (bookParameter == null || bookParameter == undefined) {
        return res.send({
            msg: "No parameter is present"
        })
    }


    let bookIdIsPresent = await bookModel.findOne({
        _id: bookParameter,
        isDeleted: false
    });

    if (bookIdIsPresent == null) {
        return res.send({
            msg: "No book is present with this ID"
        });

    }

    let data = req.body;

    let updatingBook = await bookModel.findByIdAndUpdate(bookParameter, data, {
        new: true
    })
    return res.send({
        msg: updatingBook
    });
}


// Delete Book

const deleteBook = async function (req, res) {
    let bookParameter = req.params.bookId;
    if (bookParameter == null || bookParameter == undefined) {
        return res.send({
            msg: "No parameter is present"
        })
    }
    let bookIdIsPresent = await bookModel.findOne({
        _id: bookParameter,
        isDeleted: false
    });

    if (bookIdIsPresent == null) {
        return res.send({
            msg: "No book is present with this ID"
        });

    }

    let deletedBook = await bookModel.findByIdAndUpdate(bookParameter, {
        isDeleted: true,
        deletedAt: new Date()
    }, {
        new: true
    })
    return res.send({
        msg: deletedBook
    });
}


module.exports.deleteBook = deleteBook
module.exports.updateBook = updateBook;
module.exports.getBookById = getBookById;
module.exports.findBook = findBook;
module.exports.createBook = createBook;