const authorModel = require('../model/authorModel');

const authorCreate = async function (req,res){
    let content = req.body;
    let data = await authorModel.create(content);
    res.send({msg:data});
}

module.exports.authorCreate = authorCreate;