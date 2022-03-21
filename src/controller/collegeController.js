const collegeModel = require('../model/collegeModel');

const createCollege = async function(req,res){

    let data = req.body;
    let {isDeleted,abbName} = data;
    if(Object.keys(data).length===0){
       return res.status(400).send({msg:"No data is present in req.body"})
    }

    try{
        
    let isPresent= await collegeModel.findOne({name:abbName});
   
    if(!isPresent){
       return res.status(400).send({msg:"College data is already present"});
    }

    if(isDeleted===true){
      return  res.status(401).send({msg:"Value is already deleted"})
    };

    let createCollegeEntry = await collegeModel.create(data);
    
    return res.status(200).send({msg:{createCollegeEntry}});
    }catch(err){
        return res.status(403).send(err.message);
    }

}

const collegeDetails = async function(req,res){

    let data = req.query;
    let {collegeName} = req.query;
    if(Object.keys(data).length===0){
        return res.status(404).send({msg:"Not data in req query"})
    }

   
    let collegeData = await collegeModel.findOne({name:collegeName});
    let findInterns = await internModel.find({collegeId:collegeData._id})
    return res.status(202).send({data:findInterns});


}
module.exports.collegeDetails = collegeDetails;

module.exports.createCollege = createCollege;