const authorModel = require('../model/authorModel');

const authorCreate = async function (req,res){
    try{
        let content = req.body;
    let data = await authorModel.create(content);
    res.status(200).send({msg:data});
    }catch(err){
        res.send({msg:"Error",error:err.message})
    }
}

module.exports.authorCreate = authorCreate;