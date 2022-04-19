const mongoose = require("mongoose");
//validation checking function
const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

const isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0;
};

const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId);
};

const isavailableSizesValid = function (availableSizes) {
  return ["S", "XS","M","X", "L","XXL", "XL"].indexOf(availableSizes) !== -1
}
const isvalidNumber = function (value) {
  if (typeof value === "Number") {
    return true;
  }
}

const isValidCurrencyFormat = function (currencyFormat) {
  return ['₹'].indexOf(currencyFormat) !== -1
}


module.exports = {
  isValidCurrencyFormat,
  isvalidNumber,
  isavailableSizesValid,
  isValid,
  isValidRequestBody,
  isValidObjectId,
};