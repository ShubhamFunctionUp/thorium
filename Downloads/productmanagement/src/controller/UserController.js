const { default: mongoose } = require('mongoose');
// const { findOneAndUpdate } = require('../models/UserModel');
const UserModel = require('../models/UserModel');
const awsFile = require('../S3/awsFile');
// const aws = require("aws-sdk")
const validator = require('../validator/validator');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')






const register = async function(req,res){
try{

    const requestBody = req.body;

    if (!validator.isValidRequestBody(requestBody) && !validator.isValid(req.files)) {
      return res
        .status(400)
        .send({ status: false, message: "not a valid request body" });
    } else {
      const { fname,lname, phone, email, password, address} =
        requestBody;
     
     
     
    // /////////////////// First Name Validation////////////////////////////////////////
     
        if (!validator.isValid(fname)) {
        return res
          .status(400)
          .send({ status: false, message: "enter valid fname" });
      }
      let isName = /^[A-Za-z ]*$/;
      if (!isName.test(fname)) {
        return res
          .status(422)
          .send({ status: false, message: "enter valid fname" });
      }


    //   //////////////////////////// Last Name validation ////////////////////////////////
      if (!validator.isValid(lname)) {
        return res
          .status(400)
          .send({ status: false, message: "enter valid lname" });
      }
     
      if (!isName.test(lname)) {
        return res
          .status(422)
          .send({ status: false, message: "enter valid lname" });
      }



    //   //////////////////////// Phone Number Validation //////////////////////////////////////////

      if (!validator.isValid(phone)) {
        return res
          .status(400)
          .send({ status: false, message: "enter valid phone" });
      }

      if (!/^[1-9]\d{9}$/.test(phone)) {
        return res
          .status(422)
          .send({
            status: false,
            message:
              "please enter 10 digit number which does not contain 0 at starting position",
          });
      }

      const isPhoneAlreadyUsed = await UserModel.findOne({
        phone,
        isDeleted: false,
      });

      if (isPhoneAlreadyUsed) {
        return res.status(409).send({
          status: false,
          message: `${phone} this phone number is already used so please put valid input`,
        });
      }

      
    // <--------------------------------------------  Email Valildation-----------------------------------------?
      
      if (!validator.isValid(email)) {
        return res
          .status(400)
          .send({ status: false, message: "enter valid email" });
      }
      if (!/^([a-z0-9\.-]+)@([a-z-]+).([a-z]+)$/.test(email)) {
        // john45665@gmail.com
        return res
          .status(422)
          .send({
            status: false,
            message: "email is invalid please enter valid email",
          });
      }

      const isEmailAlreadyUsed = await UserModel.findOne({
        email,
        isDeleted: false,
      });

      if (isEmailAlreadyUsed) {
        return res.status(409).send({
          status: false,
          message: `${email} is already used so please put valid input`,
        });
      }

    //   <----------------------------------------------------Password Validation-------------------------------->

      if (!validator.isValid(password)) {
        return res
          .status(400)
          .send({ status: false, message: "enter valid password" });
      }

      let isPasswordPresent = await UserModel.findOne({password:password});
        
      if(isPasswordPresent){
          return res.status(409).send({status:false,msg:"Password is already Present"})
      }

    //   if (!validator.isValid(address)) {
    //     return res
    //       .status(400)
    //       .send({ status: false, message: "enter valid address" });
    //   }
    if (address) {
        if (address.shipping) {
            if (!validator.isValid(address.shipping.street)) {
                res.status(400).send({ status: false, Message: "Please provide street name in shipping address" })
                return
            }
            if (!validator.isValid(address.shipping.city)) {
                res.status(400).send({ status: false, Message: "Please provide city name in shipping address" })
                return
            }
            if (!validator.isValid(address.shipping.pincode)) {
                res.status(400).send({ status: false, Message: "Please provide pincode in shipping address" })
                return
            }
        }
        if (address.billing) {
            if (!validator.isValid(address.billing.street)) {
                res.status(400).send({ status: false, Message: "Please provide street name in billing address" })
                return
            }
            if (!validator.isValid(address.billing.city)) {
                res.status(400).send({ status: false, Message: "Please provide city name in billing address" })
                return
            }
            if (!validator.isValid(address.billing.pincode)) {
                res.status(400).send({ status: false, Message: "Please provide pincode in billing address" })
                return
            }
        }
    }
    }


// <--------------------------------------------AWS --------------------------------------------->
    let files = req.files
    let {fname,lname,email,phone} = req.body;
    let storeData = req.body;      //Object access is given
    if(files && files.length>0){
        let uploadFileURL = await awsFile.uploadFile(files[0]);
        storeData.profileImage = uploadFileURL
        // return res.send({msg:"Succesffully got the link",data:storeData})
        console.log("Image Successfully uploaded");
    }else{
       return res.send( {msg:"File is not present"})
    }

   

    let createEntries = await UserModel.create(storeData)
    return res.send({status:true,data:createEntries})
}
catch(err){
    return res.send({msg:err.message})
}


}

let isValidObjectId = function (objectId){
    return mongoose.Types.ObjectId.isValid(objectId)
}

const getUser = async function(req,res){
    let userId = req.params.userId;
  
    try{
       
    // if(userId==" " || typeof userId == undefined || userId==null){
    //     return res.status(400).send({status:false,msg:"Please insert valid UserId"})
    // }

    if(!isValidObjectId(userId)){
        return res.status(400).send({status:false,message:"Not a Valid Object ID"})
    }

    let isUserPresent = await UserModel.findById(userId)

    if(!isUserPresent){
        return res.status(400).send({status:false,msg:"User is not present"})
    }

    return res.status(200).send({status:true,data:isUserPresent})

   }
   catch(err){
       return res.status(500).send({msg:err.message})
   }
}


// //////////////////////    UPDATE USER                 /////////////////////////////////


const updateUser = async function(req,res){
    let {userId} = req.params;
    
    if(!validator.isValidRequestBody(req.body) && !validator.isValid(req.files)){
        return res.status(400).send({status:false,message:"Please Enter something in request body"})   
    }
    console.log();

    if(!isValidObjectId(userId)){
        return res.status(400).send({status:false,message:"Not a Valid Object ID"})
    }

    let userIsPresent = await UserModel.findOne({userId:userId});
    
    if(!userIsPresent){
        return res.status(400).send({status:false,msg:"User is not present"})
    }

    
    // email,profileImage,password,phone,address,fname,lname
    let {email,password,phone,address,fname,lname}= req.body;
    // let {street,pincode,city} = address;
    
    let obj = {};
    if (validator.isValid(address) && validator.isValidRequestBody(address)) {
        if (validator.isValid(address.shipping) && validator.isValidRequestBody(address.shipping)) {
            if (!validator.isValid(address.shipping.street)) {
                res.status(400).send({ status: false, Message: "Please provide street name in shipping address" })
                return
            }else{
                obj["address.shipping.street"] = address.shipping.street 
            }
            if (!validator.isValid(address.shipping.city)) {
                res.status(400).send({ status: false, Message: "Please provide city name in shipping address" })
                return
            }else{
                obj["address.shipping.city"] = address.shipping.city
            }
            if (!validator.isValid(address.shipping.pincode)) {
                res.status(400).send({ status: false, Message: "Please provide pincode in shipping address" })
                return
            }else{
                // if ("^[1-9][0-9]{5}$)$".test(address.shipping.pincode)) {
                    
                //     return res
                //       .status(422)
                //       .send({
                //         status: false,
                //         message: "pincode is invalid please enter valid email",
                //       });
                //   }
                obj["address.shipping.pincode"] = address.shipping.pincode
            }
        }

    if (validator.isValid(address.billing) && validator.isValidRequestBody(address.billing)) {
        console.log(typeof address.billing.pincode);    
        if (!validator.isValid(address.billing.street)) {
                res.status(400).send({ status: false, Message: "Please provide street name in billing address" })
                return
            }else{
                obj["address.billing.street"] = address.billing.street
            }
            if (!validator.isValid(address.billing.city)) {
                res.status(400).send({ status: false, Message: "Please provide city name in billing address" })
                return
            }else{
                obj["address.billing.city"] = address.billing.city
            }
            if (!validator.isValid(address.billing.pincode)) {
                res.status(400).send({ status: false, Message: "Please provide pincode in billing address" })
                return
            }else{
               
                // if ("^[1-9][0-9]{5}$)$".test(address.shipping.pincode)) {
                    
                //     return res
                //       .status(422)
                //       .send({
                //         status: false,
                //         message: "pincode is invalid please enter valid email",
                //       });
                //   }

                obj["address.billing.pincode"] = address.billing.pincode
            }
        }
    }



    if(validator.isValid(email)){
     
     let emailPresent = await UserModel.findOne({email:email});
        if(emailPresent){
             return res.status(409).send({status:false,msg:"Email is already present"})
        }else{
            obj.email = email;
            }
    }


    let files = req.files
    if(validator.isValid(files)){
           
            if(files && files.length>0){
                let profileImage = await awsFile.uploadFile(files[0]);
                obj.profileImage = profileImage;
                console.log("Image Successfully uploaded");
            }           
        
    }

    if(validator.isValid(password)){
        // obj.password = password;
        let passwordPresent = await UserModel.findOne({password:password});
        if(passwordPresent){
             return res.status(409).send({status:false,msg:"password is already present"})
        }else{
            obj.password = password;
            }
    }

    if(validator.isValid(phone)){
        // obj.phone = phone;
        let phonePresent = await UserModel.findOne({phone:phone});
        if(phonePresent){
             return res.status(409).send({status:false,msg:"phone is already present"})
        }else{
            obj.phone = phone;
            }
    }  
    // if(!validator.isValidRequestBody(address)){
    //     // obj.address = address;
    //     return res.send({msg:"Please insert address correctly"})

    // }  
    if(validator.isValid(fname)){
        // obj.fname = fname;
        obj.fname = fname;
      
    }  
    if(validator.isValid(lname)){
        // obj.lname = lname;
        obj.lname = lname;
    } 
   
    let updateUser = await UserModel.findOneAndUpdate({_id:userId},{
        $set:{
            ...obj
        }    
    },{
        new:true
    })


    return res.status(201).send({status:true,message:"Update User Data",data:updateUser})
}


const login = async function(req,res){
    let email = req.body.email;
    let password = req.body.password;
     
    if (!validator.isValid(email)) {
        return res
          .status(400)
          .send({ status: false, message: "enter valid email" });
      }
      if (!/^([a-z0-9\.-]+)@([a-z-]+).([a-z]+)$/.test(email)) {
        // john45665@gmail.com
        return res
          .status(422)
          .send({
            status: false,
            message: "email is invalid please enter valid email",
          });
      }

      let isUserGen = await UserModel.findOne({email:email,password:password});
      console.log(isUserGen);
      if(!isUserGen){
          return res.status(400).send({status:false,msg:"false",data:"Email or password is not correct"})
      }

      let token = jwt.sign({userId:isUserGen._id},"Shubham");
      
      return res.status(200).send({status:true,message:"Token is generated Successfully",data:token});


}

module.exports.updateUser = updateUser
module.exports.getUser = getUser;
module.exports.register = register
module.exports.login = login

