const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const createUser = async function (req,res){
    let data = req.body;
    if(Object.keys(data).length==0){
        return res.send({status:false,msg:"Please insert data"});
    }
    let {title,name,email,password,address,phone} = data;
    let {street,city,pincode} = address;

    if(title==""){
        return res.send({status:false,msg:"Please insert inside the title"})
    }
    if(name==""){
        return res.send({status:false,msg:"Please insert inside the name"})
    }if(email==""){
        return res.send({status:false,msg:"Please insert inside the email"})
    }if(password==""){
        return res.send({status:false,msg:"Please insert inside the password"})
    }
    if(street==""){
        return res.send({status:false,msg:"Please insert inside the street"})
    }if(city==""){
        return res.send({status:false,msg:"Please insert inside the city"})
    }if(pincode==""){
        return res.send({status:false,msg:"Please insert inside the pincode"})
    }
    if(phone==""){
        return res.send({status:false,msg:"Please insert inside the phone"})
    }
    if(phone.length==="10"){
        return res.send({msg:"Please enter 10 digit Number"});
    }

    if(!/^([a-z0-9\.-]+)@([a-z-]+).([a-z]+)$/.test(email)){
        return res.send({msg:"Please enter valid email"})
    }

    let emailPresent = await userModel.findOne({email:email})
    if(emailPresent!=null){
        return res.send({msg:"Email is already present"});
    }

    let phonePresent = await userModel.findOne({phone:phone})
    if(phonePresent!=null){
        return res.send({msg:"phonee is already present"});
    }


    let successFullyInserted = await UserModel.create(data);
    res.send({status:true,msg:successFullyInserted})

}

const login = async function(req,res){
    let data = req.body;
    if(Object.keys(data).length==0){
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