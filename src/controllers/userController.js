const userModel = require('../models/userModel');
const createUser= async function (req, res) {
    let data = req.body;
    let reqData = await userModel.create(data);
    res.send({msg:reqData});
}



module.exports.createUser= createUser
