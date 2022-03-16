const authorModel = require('../model/authorModel');
const emailvalidator = require("email-validator");

const authorCreate = async function (req,res){
    try{
    let content = req.body;
    let email = req.body.email;
    if(emailvalidator.validate(email)){
        let filter = {
            ...content
        }
        let isPresent = await authorModel.find(filter);
        if(isPresent.length===0){
            let data = await authorModel.create(content);
            res.status(200).send({msg:data});   
        }
        res.send({msg:"author is already present"})
        
        
    }else{
        res.status(400).send("Invalid Email")
    }
    }catch(err){
        res.send({msg:"Error",error:err.message})
    }
}

module.exports.authorCreate = authorCreate;