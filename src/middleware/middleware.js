const mid1 = async function (req,res,next) {
    let headerBoolean = req.headers.isfreeappuser 
    console.log(headerBoolean);
    if(headerBoolean=="false"){
        return res.send("request is missing a mandatory header")
    }else{
        next();
    }
}

module.exports.mid1 = mid1;