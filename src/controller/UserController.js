const UserModel = require("../Model/UserModel")
const mongoose = require('mongoose')
const bcrypt =require('bcrypt')
const jwt = require('jsonwebtoken')
const aws = require('../Aws/aws-s3')

const isValid = function (value) {
    if (typeof value == undefined || value == null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
  };

  const isBodyRequestValid = function (requestBody) {
    return Object.keys(requestBody).length > 0
  }

  let isValidObjectId = function (objectId){
    return mongoose.Types.ObjectId.isValid(objectId)
}

const isValidfiles = function (files) {
    if (files && files.length > 0)
        return true
}


const createUser = async function(req,res){
  
    try{
        let files = req.files
         let requestBody = req.body
        

         if(!isBodyRequestValid(requestBody)){
             return res.status(400).send({status:false,msg:"No input provided"})
         }
         
         let {fname,lname,email,profileImage,phone,password,address} = requestBody

         if(!isValid(fname)){
             return res.status(400).send({status:false,msg:"fname is required"})
         }

         if(!isValid(lname)){
            return res.status(400).send({status:false,msg:"lname is required"})
        }

        if(!isValid(email)){
            return res.status(400).send({status:false,msg:"email is required"})
        }

        if(!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email))){
            res.status(400).send({status:false, msg:"email is not valid"})
            return
        }

        const isEmailUsed = await UserModel.findOne({email})
        if (isEmailUsed) {
            res.status(400).send({status:false, msg:"email should be unique"})
            return
        }

    
        profileImage = await aws.uploadFile(files[0])
        console.log(profileImage)
        
        if(!isValid(phone)){
            return res.status(400).send({status:false,msg:"phone is required"})
        }

         if(!(/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(phone))){
            res.status(400).send({status:false, msg:"phone no is not valid"})
            return
        }

        const isPhoneUsed = await UserModel.findOne({phone})
        if (isPhoneUsed) {
            res.status(400).send({status:false, msg:"phone no should be unique"})
            return
        }
    

        if(!isValid(password)){
            return res.status(400).send({status:false,msg:"password is required"})
        }

        if (password.length<8 || password.length>15) {
            return res.status(400).send({status:false, msg:"Password should be between 8-15"})
        }

        let saltRounds = 10;         
        const salt = await bcrypt.genSalt(saltRounds)
        console.log(salt)
         let hash = await bcrypt.hash(req.body.password,salt)
         console.log(hash)

        const isPasswordUsed = await UserModel.findOne({password})
        if (isPasswordUsed) {
            res.status(400).send({status:false, msg:"password no should be unique"})
            return
        }

        


        if(!isValid(address))
            return res.status(400).send({status:false,msg:"address is required"})
        

        if (!isBodyRequestValid(req.body.address.shipping))
           return res.status(400).send({ status: false, msg: "please provide shipping details" });
        
        if (address.shipping) {
        if (!isValid(address.shipping.street))
           return res.status(400).send({ status: false, msg: "please provide street details" });

        if (!isValid(address.shipping.city))
           return res.status(400).send({ status: false, msg: "please provide city details" });

        if (!isValid(address.shipping.pincode))
           return res.status(400).send({ status: false, msg: "please provide pincode details" });
        }

        if (!isBodyRequestValid(req.body.address.billing))
           return res.status(400).send({ status: false, msg: "please provide billing details" });
        

        if (address.billing) {
        if (!isValid(address.billing.street))
           return res.status(400).send({ status: false, msg: "please provide street details" });

        if (!isValid(address.billing.city))
           return res.status(400).send({ status: false, msg: "please provide city details" });

        if (!isValid(address.billing.pincode))
           return res.status(400).send({ status: false, msg: "please provide pincode details" });
        }


        
        
        const updatedBody = { fname, lname, email,profileImage,phone, password:hash, address }
        let user = await UserModel.create(updatedBody)
     return res.status(201).send({ status: true, message: 'User created successfully', data: user })
    
   }
    catch(error){
           return res.status(500).send({status:false,msg:error.msg})
    }
}

const UserLogin = async function (req, res) {
    try {
        let data = req.body

        //validations starts-
        if (!isBodyRequestValid(data)) {
            return res.status(400).send({ status: false, message: " Please provide input to login" })
        }

        const { email, password } = data


        if (!isValid(email)) {
            return res.status(400).send({ status: false, msg: "email is required" })

        }

        if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email))) {
           return res.status(400).send({ status: false, msg: "email is not valid" })
        }

        if (!isValid(password)) {
            return res.status(400).send({ status: false, msg: "password is required" })
            
        }

        if (password.length<8 || password.length>15) {
            return res.status(400).send({status:false, msg:"Password should be between 8-15"})
        }


        //validations ends-

        if (data.email && data.password) {

            let emailMatch = await UserModel.findOne({ email: data.email });

            if (!emailMatch) {
                return res.status(400).send({ status: false, msg: "No user is registered with this email" })
            }

            const decryptPassword = await bcrypt.compare(data.password, emailMatch.password)
            console.log(decryptPassword)

            if (!decryptPassword) {
                return res.status(400).send({ status: false, msg: "Incorrect password" })
            }

        //sending jwt-
        const token = jwt.sign({
            userId: emailMatch._id
        }, "secret key", { expiresIn: "30m" })
        res.setHeader("x-api-key", token)

        return res.status(200).send({ status: true, msg: "User login successfull", userId: emailMatch._id, token })
    }
    } catch (error) {
        res.status(500).send({ status: false, msg: error.msg })
    }
}

const getUser = async function(req,res){
   
   try{
    let userId = req.params.userId;
    // if(userId==" " || typeof userId == undefined || userId==null){
    //     return res.status(400).send({status:false,msg:"Please insert valid UserId"})
    // }
    // if(!userId){
    //     return res.status(400).send({status:false,msg:"please provide userId"})
    // }

    if(!isValidObjectId(userId)){
        return res.status(400).send({status:false,message:"Not a Valid Object ID"})
    }

    let isUserPresent = await UserModel.findById(userId)

    if(!isUserPresent){
        return res.status(400).send({status:false,msg:"User is not present"})
    }

    return res.status(200).send({status:true,msg:"User profile details",data:isUserPresent})

   }
   catch(err){
       return res.status(500).send({status:false,msg:err.message})
   }
}

const UpdateUser = async function (req, res) {
    try{

    let data = req.body;
    const userId = req.params.userId

    //Validations Starts-

    // if (!validator.isValidRequestBody(data) || !validator.isValidRequestBody(req.files)) {
    //     return res.status(400).send({ status: false, message: " Please provide data to update" })
    // }

    const { fname, lname, email, phone, password, address } = data

    const updatedData = {}

    //fname validation
    if (fname) {
        if (!isValid(fname)) {
            return res.status(400).send({ status: false, Message: "First name is required" })
        }
        updatedData.fname = fname
    }

    //lname validation-
    if (lname) {
        if (!isValid(lname)) {
            return res.status(400).send({ status: false, Message: "Last name is required" })
        }
        updatedData.lname = lname
    }

    //email validation-
    if (email) {
        if (!isValid(email)) { return res.status(400).send({ status: false, message: "email is required" }) }

        if (!(/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(email.trim()))) return res.status(400).send({ status: false, msg: "Please provide a valid email" });

        const isEmailUsed = await UserModel.findOne({ email: email })
        if (isEmailUsed) {
            return res.status(400).send({ status: false, msg: "email must be unique" })
        }
        updatedData.email = email
    }


    //profile pic upload and validation-

    let saltRounds = 10
    const files = req.files

    if (isValidfiles(files)) {
        const profilePic = await aws.uploadFile(files[0])

        updatedData.profileImage = profilePic

    }

    //phone validation-
    if (phone) {
        if (!isValid(phone)) { return res.status(400).send({ status: false, message: "Phone number is required" }) }
        if (!(/^([+]\d{2})?\d{10}$/.test(phone))) return res.status(400).send({ status: false, msg: "please provide a valid phone number" })

        const isPhoneUsed = await UserModel.findOne({ phone: phone })
        if (isPhoneUsed) {
            return res.status(400).send({ status: false, msg: "phone number must be unique" })
        }
        updatedData.phone = phone
    }

    //password validation-
    if (password) {
        if (!isValid(password)) { return res.status(400).send({ status: false, message: "password is required" }) }
       // if (!(/^(?=.?[A-Z])(?=.?[a-z])(?=.?[0-9])(?=.?[#?!@$%^&*-]).{8,15}$/.test(data.password.trim()))) { return res.status(400).send({ status: false, msg: "please provide a valid password with one uppercase letter ,one lowercase, one character and one number " }) }
       if (password.length<8 || password.length>15) {
        return res.status(400).send({status:false, msg:"Password should be between 8-15"})
    }
        const encryptPassword = await bcrypt.hash(password, saltRounds)

        updatedData.password = encryptPassword
    }


    //address validation-

    if (address) {

        if (address.shipping) {

            if (!isValid(address.shipping.street)) {
                return res.status(400).send({ status: false, Message: "street name is required" })
            }
            updatedData["address.shipping.street"] = address.shipping.street


            if (!isValid(address.shipping.city)) {
                return res.status(400).send({ status: false, Message: "city name is required" })
            }
            updatedData["address.shipping.city"] = address.shipping.city

            if (!isValid(address.shipping.pincode)) {
                return res.status(400).send({ status: false, Message: "pincode is required" })
            }
            updatedData["address.shipping.pincode"] = address.shipping.pincode

        }

        if (address.billing) {
            if (!isValid(address.billing.street)) {
                return res.status(400).send({ status: false, Message: "Please provide street name in billing address" })
            }
            updatedData["address.billing.street"] = address.billing.street

            if (!isValid(address.billing.city)) {
                return res.status(400).send({ status: false, Message: "Please provide city name in billing address" })
            }
            updatedData["address.billing.city"] = address.billing.city

            if (!isValid(address.billing.pincode)) {
                return res.status(400).send({ status: false, Message: "Please provide pincode in billing address" })
            }
            updatedData["address.billing.pincode"] = address.billing.pincode
        }
    }

    //update data-

    const updatedUser = await UserModel.findOneAndUpdate({ _id: userId }, updatedData, { new: true })

    return res.status(200).send({ status: true, message: "User profile updated", data: updatedUser });
    }
    catch(err){
        return res.status(500).send({status:false,msg:err.message})
    }
}



module.exports.createUser = createUser
module.exports.getUser=getUser
module.exports.UserLogin=UserLogin
module.exports.UpdateUser=UpdateUser