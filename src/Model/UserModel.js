const mongoose = require('mongoose')
//const bycrpt = require('bcrypt')
const UserSchema = new mongoose.Schema(
    {
        fname: {
            type: String,
            require: true
        },
        lname: {
            type: String,
            require: true
        },
        email: {
            type: String,
            require: true,
            unique: true,
            validate: {
                validator: function (email) {
                    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
                }, message: 'Please fill a valid email address', isAsync: false
            }
        },
        profileImage: {
            type: String,
            require: true
        },
        phone: {
            type: String,
            require: true,
            unique: true,
            validate: {
                validator: function (mobile) {
                    return /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(mobile)
                }, message: 'Please fill a valid mobile number', isAsync: false
            }
        },
        password: {
            type: String,
            require: true,
            minLen: 8,
            maxLen: 15
        },
        address: {
            shipping: {
                street: {
                    type: String,
                    require: true
                },
                city: {
                    type: String,
                    require: true
                },
                pincode: {
                    type: Number,
                    require: true
                }
            },
            billing: {
                street: {
                    type: String,
                    require: true
                },
                city: {
                    type: String,
                    require: true
                },
                pincode: {
                    type: Number,
                    require: true
                }
            }
        }


    }, { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema)

