const internModel = require('../model/internModel');
const collegeModel = require('../model/collegeModel');
const emailvalidator = require("email-validator");
const createIntern = async function(req,res){
    let data = req.body;
    let {isDeleted,collegeId,name,email} = data;  
try{
    
    if(Object.keys(data).length===0){
        return res.status(404).send({status:false,msg:"No data is present"});
     }


    //  if(mobile.length<10){
    //      res.status(400).send({status:false,msg:"Phone number is else then 10"})
    //  }
 
     if(emailvalidator.validate(email)){
 
     if(isDeleted===true){
         return res.status(400).send({status:false,msg:"Data is already deleted"});
     }
 
     let collegePresent = await collegeModel.findById(collegeId);
     // console.log(collegePresent)
     if(!collegePresent){
         return res.status(404).send({status:false,msg:"College is not present"});
     }
     
     let isPresent = await internModel.findOne({$and:[{name:name},{email:email}]});
     // console.log(!isPresent)
     if(isPresent!=null){
         return res.status(404).send({status:false,msg:"Intern is already present"})
     }
 
     let createIntern = await internModel.create(data);
     return res.status(200).send({status:true,data:createIntern});
     }else{
         res.status(400).send({msg:"invalid email"})
     }
}catch(err){
    res.status(400).send({status:false,msg:err.message})
}
}

module.exports.createIntern = createIntern;

