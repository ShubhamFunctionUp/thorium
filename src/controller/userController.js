const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const createUser = async function (req,res){
    let data = req.body;
    if(Object.keys(data)==0){
        return res.send({status:false,msg:"Please insert data"});
    }

    let successFullyInserted = await UserModel.create(data);
    res.send({status:true,msg:successFullyInserted})

}

const login = async function(req,res){
    let data = req.body;
    if(Object.keys(data)==0){
        return res.send({status:false,msg:"Please insert data"});
    }

    let {email,password} = data;
    let isEmailPresent = await userModel.findOne({email:email,password:password});
    if(!isEmailPresent){
        return res.send({status:false,msg:"Email and password is incorrect"});
    }

    let userId = isEmailPresent._id;

    let token = jwt.sign({
        userId:userId.toString(),
        project:"Project3",
        organization:"FunctionUp"
    },"Group7",
    {expiresIn: "1m"}
    );

    res.setHeader('x-auth-token',token);
    return res.send({status:false,msg:token});


}
module.exports.login = login
module.exports.createUser = createUser;