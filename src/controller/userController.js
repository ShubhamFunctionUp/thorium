const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
// const { body, validationResult } = require('express-validator');
const createUser = async function (req, res) {
    let data = req.body;
    if (Object.keys(data).length == 0) {
        return res.send({
            status: false,
            msg: "Please insert data"
        });
    }
    let {
        title,
        name,
        email,
        password,
        address,
        phone
    } = data;
    let {
        street,
        city,
        pincode
    } = address;



    // if(body('email').isEmail())
    console.log(title);
    if (title == "" || typeof (title) == "undefined" || typeof (title) == "null") {
        return res.send({
            status: false,
            msg: "Please insert inside the title"
        })
    }
    if (name == "" || typeof (name) == "undefined" || typeof (name) == "null") {
        return res.send({
            status: false,
            msg: "Please insert inside the name"
        })
    }
    if (email == "" || typeof (email) == "undefined" || typeof (email) == "null") {
        return res.send({
            status: false,
            msg: "Please insert inside the email"
        })
    }
    if (password == "" || typeof (password) == "undefined" || typeof (password) == "null") {
        return res.send({
            status: false,
            msg: "Please insert inside the password"
        })
    }
    if (street == "" || typeof (street) == "undefined" || typeof (street) == "null") {
        return res.send({
            status: false,
            msg: "Please insert inside the street"
        })
    }
    if (city == "" || typeof (city) == "undefined" || typeof (city) == "null") {
        return res.send({
            status: false,
            msg: "Please insert inside the city"
        })
    }
    if (pincode == "" || typeof (pincode) == "undefined" || typeof (pincode) == "null") {
        return res.send({
            status: false,
            msg: "Please insert inside the pincode"
        })
    }
    if (phone == "" || typeof (phone) == "undefined" || typeof (phone) == "null") {
        return res.send({
            status: false,
            msg: "Please insert inside the phone"
        })
    }
    if (phone.length === "10") {
        return res.send({
            msg: "Please enter 10 digit Number"
        });
    }

    if (!/^([a-z0-9\.-]+)@([a-z-]+).([a-z]+)$/.test(email)) {
        return res.send({
            msg: "Please enter valid email"
        })
    }

    if (!["Mr", "Mrs", "Miss"].includes(title)) {
        return res.status(400).send({
            status: false,
            msg: "Please insert title among Mr,Mrs or Miss"
        })
    }

    if (! /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(password)) {
        return res.status(400).send({
            status: false,
            msg: "Please enter Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"
        })
    }

    let emailPresent = await userModel.findOne({
        email: email
    })
    if (emailPresent != null) {
        return res.status(409).send({
            msg: "Email is already present"
        });
    }

    let phonePresent = await userModel.findOne({
        phone: phone
    })
    if (phonePresent != null) {
        return res.send({
            msg: "phonee is already present"
        });
    }


    let successFullyInserted = await UserModel.create(data);
    res.send({
        status: true,
        msg: successFullyInserted
    })

}

const login = async function (req, res) {
    let data = req.body;
    if (Object.keys(data).length == 0) {
        return res.send({
            status: false,
            msg: "Please insert data"
        });
    }

    let {
        email,
        password
    } = data;

    // if (!/^([a-z0-9\.-]+)@([a-z-]+).([a-z]+)$/.test(email)) {
    //     return res.status(400).send({
    //         msg: "Please enter valid email"
    //     })
    // }

    // if (! /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(password)) {
    //     return res.status(401).send({
    //         status: false,
    //         msg: "Please enter Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"
    //     })
    // }



    let isEmailPresent = await userModel.findOne({
        email: email,
        password: password
    });
    if (!isEmailPresent) {
        return res.status(400).send({
            status: false,
            msg: "Email and password is incorrect"
        });
    }

    let userId = isEmailPresent._id;

    let token = jwt.sign({
        userId: userId.toString(),
        project: "Project3",
        organization: "FunctionUp"
    }, "Group7", {
        expiresIn: "100m"
    });

    res.setHeader('x-auth-token', token);
    return res.send({
        status: false,
        msg: token
    });


}
module.exports.login = login
module.exports.createUser = createUser;