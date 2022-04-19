const UserModel= require('../Model/UserModel.js')
const mongoose = require('mongoose')
const jwt = require("jsonwebtoken");

let isValidObjectId = function (objectId){
    return mongoose.Types.ObjectId.isValid(objectId)
}



const authentication = async function(req, res, next){
    try{
        const bearerHeader = req.headers['authentication'];
        if(!bearerHeader){
              return res.status(401).send({status : false, message : "token is missing"})
             }
        if(typeof bearerHeader != 'undefined'){

            const bearer = bearerHeader.split(' ');
//if (!bearer) return res.status(400).send({status:false,msg:"please provide bearer"})
        
            const bearerToken = bearer[1];
            req.token = bearerToken;
            next()
        }
        else{
            res.sendStatus(403);
        }

    }catch (err) {
        console.log(err)
         res.status(500).send({ msg: err.message })
     }
}

const authorization = async function(req, res, next){
    //const bearerHeader = req.headers['authentication'];
    const userId = req.params.userId
    const   decodedtoken = jwt.verify( req.token, "secret key")

    if(!isValidObjectId(userId)){
        return res.status(400).send({status :false , message : " enter a valid userId"})
    }

    const userByUserId = await UserModel.findById(userId)
  

    if(!userByUserId){
        return res.status(404).send({status :false , message : " user not found"}) 
    }

    if(userId !== decodedtoken.userId){
        return res.status(403).send({status :false , message : "unauthorized access"})  
    }

    next()
}

module.exports.authentication =authentication
module.exports.authorization =authorization