const UserModel = require("../models/userModel")

// const createUser= async function (req, res) {
//     let data= req.body
//     let savedData= await UserModel.create(data)
//     res.send({msg: savedData})
// }

// const getUsersData= async function (req, res) {
//     let allUsers= await UserModel.find()
//     res.send({msg: allUsers})
// }

// module.exports.createUser= createUser
// module.exports.getUsersData= getUsersData

const getBook = async function (req,res) {
    let allbook = await UserModel.find();
    res.send({msg:allbook});
}

const createBook = async function (req, res) {
    let data = req.body;
    let savedBook =await UserModel.create(data);
    res.send({ msg: savedBook });
}
module.exports.createBook = createBook;
module.exports.getBook =getBook;