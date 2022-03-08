const userModel = require('../models/userModel');
const jwt = require("jsonwebtoken");
const loginUser = async function (req,res,next) {
    let userName = req.body.emailId;
    let password = req.body.password;
    console.log(userName,password);
    let user = await userModel.findOne({emailId:userName,password:password});
    console.log(user.length===0);
    if(!user){
      return res.send({status:false,msg:"username or the password is not correct"})
    }
  
    let token = jwt.sign({
      userId:user._id.toString(),
      batch:"thorium",
      organization:"Shubham InfoMedia"
    },"Shubham-thorium" );                     //secret Key
  
    res.setHeader("x-auth-token",token);
    // res.send({status:true,data:token})
    next()
  
  }

  const isConnected = async function(req,res,next){
    let token = req.headers["X-Auth-Token"]
    if(!token){
      token = req.headers["x-auth-token"]
    }
  
    if(!token){
      res.send({status:false,msg:"Token is not present"})
    }
  
    
    let decodedToken = jwt.verify(token,"Shubham-thorium")
    
    if(!decodedToken){
      return res.send({status:false,msg:"Token is invalid"})
    }

    next();
  }

  module.exports.isConnected = isConnected;
  module.exports.loginUser = loginUser;