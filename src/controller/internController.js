const internModel = require('../model/internModel');
const collegeModel = require('../model/collegeModel');
const createIntern = async function(req,res){
    let data = req.body;
    let {isDeleted,collegeId,name,email} = data;

    if(Object.keys(data).length===0){
       return res.status(404).send({msg:"No data is present"});
    }

    if(isDeleted===true){
        return res.status(400).send({msg:"Data is already deleted"});
    }

    let collegePresent = await collegeModel.findById(collegeId);

    if(!collegePresent){
        return res.status(404).send({msg:"College is not present"});
    }
    
    let isPresent = await internModel.findOne({$and:[{name:name},{email:email}]});
    if(!isPresent){
        return res.status(404).send({msg:"Intern is already present"})
    }

    let createIntern = await interModel.create(data);
    return res.status(200).send({status:true,data:createIntern});

}

module.exports.createIntern = createIntern;

