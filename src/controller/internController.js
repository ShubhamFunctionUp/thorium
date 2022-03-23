const internModel = require('../model/internModel');
const collegeModel = require('../model/collegeModel');
const emailvalidator = require("email-validator");
const createIntern = async function(req,res){
    let data = req.body;
    let {isDeleted,collegeId,name,email,mobile} = data;  
try{
    
    if(Object.keys(data).length===0){
        return res.status(404).send({status:false,msg:"No data is present"});
     }


    //  if(mobile.length<10){
    //      res.status(400).send({status:false,msg:"Phone number is else then 10"})
    //  }
    if(name===""){
      return  res.status(400).send({msg:"name is not defined"});
    }

    if(email===""){
       return res.status(400).send({msg:"email is not defined"});
    }

    if(collegeId===""){
     return   res.status(400).send({msg:"collegeId is not defined"});
    }
    
    if(mobile===""){
        return   res.status(400).send({msg:"mobile is not defined"});
       }
 
//    


     if(emailvalidator.validate(email)){
 
     if(isDeleted===true){
         return res.status(400).send({status:false,msg:"Data is already deleted"});
     }
     let emailPresent =  await internModel.findOne({email:email})
   
     if(emailPresent!=null){
         return res.status(400).send({msg:"email is already present "});
     }
 
     let phonePresent = await internModel.findOne({mobile:mobile})
   
     if(phonePresent!=null){
         return res.status(400).send({msg:"phone number is duplicate"})
     }
     
     if(mobile.length<10){
        return res.status(400).send({status:false,msg:"please enter 10 digit"})
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
     return res.status(201).send({status:true,data:createIntern});
     }else{
         res.status(400).send({msg:"invalid email"})
     }
}catch(err){
    res.status(500).send({status:false,msg:err.message})
}
}

module.exports.createIntern = createIntern;

