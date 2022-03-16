const authorModel = require('../model/authorModel');
const emailvalidator = require("email-validator");

const authorCreate = async function (req,res){
    try{
    let content = req.body;
    let email = req.body.email;
    if(emailvalidator.validate(email)){
        let data = await authorModel.create(content);
        res.status(200).send({msg:data});    
    }else{
        res.status(400).send("Invalid Email")
    }
    }catch(err){
        res.send({msg:"Error",error:err.message})
    }
}

module.exports.authorCreate = authorCreate;