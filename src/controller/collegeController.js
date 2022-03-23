const collegeModel = require('../model/collegeModel');
const internModel = require('../model/internModel')
const createCollege = async function (req, res) {

    let data = req.body;
    let {
        isDeleted,
        name
    } = data;
    if (Object.keys(data).length === 0) {
        return res.status(400).send({
            status: false,
            msg: "No data is present in req.body"
        })
    }

    try {

        let isPresent = await collegeModel.findOne({
            name: name
        });

        if (isPresent != null) {
            return res.status(400).send({
                status: false,
                msg: "College data is already present"
            });
        }

        if (isDeleted === true) {
            return res.status(401).send({
                status: false,
                msg: "Value is already deleted"
            })
        };

        let createCollegeEntry = await collegeModel.create(data);

        return res.status(200).send({
            status: true,
            data: createCollegeEntry
        });
    } catch (err) {
        return res.status(403).send(err.message);
    }

}

const collegeDetails = async function (req, res) {

    let data = req.query;
    let {
        collegeName
    } = req.query;
    if (Object.keys(data).length === 0) {
        return res.status(404).send({
            status: false,
            msg: "Not data in req query"
        })
    }


    // object is not spread inside the array

    let collegeData = await collegeModel.findOne({
        name: collegeName,
        isDeleted: false
    }).select({
        __v: 0,
        isDeleted: 0
    });
    if (!collegeData) {
        return res.status(400).send({
            status: false,
            msg: "college is not present"
        })
    }
    let findInterns = await internModel.find({
        collegeId: collegeData._id,
        isDeleted: false
    }).select({
        collegeId: 0,
        __v: 0,
        isDeleted: 0
    })
    if (findInterns.length === 0) {
        return res.status(400).send({
            status: false,
            msg: "No student filled for interns"
        })
    }
    // let interests = [...findInterns];
    let newCollegeData = JSON.parse(JSON.stringify(collegeData));
    newCollegeData.interests = [...findInterns];

    return res.status(202).send({
        status: true,
        data: newCollegeData
    });


}
module.exports.collegeDetails = collegeDetails;

module.exports.createCollege = createCollege;