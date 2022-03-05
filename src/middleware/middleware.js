const ip = require('ip');
const moment = require('moment')
const mid1 = function (req,res,next) {
    let storeDate = moment().format('YYYY-MM-DD')
    console.log(storeDate);
    console.log(ip.address());


    next();

}

module.exports.mid1 = mid1;