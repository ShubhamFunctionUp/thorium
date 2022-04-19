const jwt = require("jsonwebtoken");
const userModel = require("../models/UserModel");
const validator = require("../validator/validator");
//-------------------authentication---------------------------------//


const authentication = async function (req, res, next) {
  try {

    let token = req.headers["x-auth-token"];
    if (!token) {
      return res
        .status(404)
        .send({ status: false, message: "Please pass token" });
    }

    let tokenIsVerify = jwt.verify(token, "Shubham")
    if(!tokenIsVerify){
      return res.status(404).send({status:false,message:"Token is not valid"})
    } 

    next();
    
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//---------------------------Authorization---------------------------------------------------------------//



const authorization = async function (req, res, next) {
    try {
      let token = req.headers["x-auth-token"];
  
      if (!token) {
        return res.status(404).send({ status: false, message: "Please pass token" });
      }

    

     let decodedToken =jwt.verify(token, "Shubham")
  
        let userId = req.params.userId;

        if (!validator.isValidObjectId(userId)) {
            return res
              .status(400)
              .send({ status: false, message: "Error!: objectId is not valid" });
          }

        let userPresent = await userModel.findOne({
            _id: userId,
            isDeleted: false,
          });

          // console.log(bookIdPresent)
          if (!userPresent) {
            return res
              .status(404)
              .send({ status: false, msg: `user with this ID: ${userId} is not found` });
          }
  
          if (userId != decodedToken.userId) {
            return res
              .status(403)
              .send({ status: false, message: "You are not authorized" });

          } else {

            next();

          }

    } catch (error) {

      return res.status(500).send({ status: false, message: error.message });

    }
  };

  module.exports.authentication = authentication
  module.exports.authorization = authorization