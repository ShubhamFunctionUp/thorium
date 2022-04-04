const urlModel = require('../model/urlModel');
const shortid = require('shortid');

function validateUrl(value){
    return /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/.test( value);
}


const createUrlShorter = async function(req,res){
    
    
    
    try {
        if(Object.keys(req.body).length==0){
            return res.status(404).send({status:false,message:"Nothing is present in req body"})
        }

        const {longUrl} = req.body;
       
        console.log(validateUrl(longUrl));
           
        if(validateUrl(longUrl)){
            
            let url = await urlModel.findOne({longUrl:longUrl})
               if(url){
                   return res.status(200).send({status:false,message:"URl is already exists"})
               }else{
                const urlCode = shortid.generate();   
                let base="http://localhost:3000";
                    const shortUrl = `${base}/${urlCode}`    //here it is not dividing it actually placing value after '/ // template literals
                    let url =await urlModel.create({
                        urlCode,
                        longUrl,
                        shortUrl,
                       
                    });

                    let toShow = {
                        urlCode:urlCode,
                        longUrl:longUrl,
                        shortUrl:shortUrl
                    }

                    res.status(201).send({status:true,data:toShow});
               }
           }else{
               return res.status(400).send({status:false,message:"Not a valid URL format"})
           } 
    } catch (error) {
        res.status(500).send({status:false,message:error.message})
    }
}

const getUrlCode = async function(req,res){


    let urlCode = req.params.urlCode;
    if(urlCode=="" || typeof urlCode ==null || typeof urlCode ==undefined ){
        return res.status(400).send({status:false,message:"Please valid Url Code"})
    }

    try{

    let urlCodeIsPresent = await urlModel.findOne({urlCode:urlCode})
    // null is falsy value and in if condition it takes only true value so 
    // when nothing is present it will give null and that is falsy so ! is reverse
    // logic part to true move inside the code


    if(!urlCodeIsPresent){
        return res.status(404).send({status:false,msg:"Url is not present"});
    }

    return res.status(301).redirect(urlCodeIsPresent.longUrl)
    // return res.send({status:true,data:urlCodeIsPresent.longUrl})
}catch(err){
    return res.status(500).send({message:err.message})
}
}

module.exports.getUrlCode = getUrlCode
module.exports.createUrlShorter = createUrlShorter