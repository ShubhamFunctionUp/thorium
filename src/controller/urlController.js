const urlModel = require('../model/urlModel');
const shortid = require('shortid');
const generate = require('meaningful-string');
const {promisify} = require("util");
let redis = require('redis')
// const { options } = require('../route/route');
let validUrl = require('valid-url')
function validateUrl(value) {
    return /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/.test(value);
}

let options = {
    "allSmall": true,
    "charLength": 6,

}



//Connect to redis
const redisClient = redis.createClient(
    12672,
  "redis-12672.c264.ap-south-1-1.ec2.cloud.redislabs.com",
  { no_ready_check: true }
);

redisClient.auth("BNxF5AmAM2GQBhfZzNgqsQ8x6C5lwywn", function (err) {
  if (err) throw err;
});

redisClient.on("connect", async function () {
  console.log("Connected to Redis..");
});



//1. connect to the server
//2. use the commands :

//Connection setup for redis

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

const createUrlShorter = async function (req, res) {

    //  const urlCode = shortid.generate().toLowerCase();
    // console.log(urlCode);
    try {
        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({
                status: false,
                message: "Nothing is present in req body"
            })
        }

        const {
            longUrl
        } = req.body;

        //// console.log(validateUrl(longUrl));
        //// console.log('Random String: ', generate.random(options));
        // if (validateUrl(longUrl)) {
        if(validUrl.isUri(longUrl)){
                                    
            // let cachedLongUrl = await GET_ASYNC(`${longUrl}`);
            // if(cachedLongUrl){
            //     return res.send({data:JSON.parse(cachedLongUrl)});
            // }else{
            //     let getLongUrl = await urlModel.findOne({longUrl:longUrl});
            //     await SET_ASYNC(`${longUrl}`,JSON.stringify(getLongUrl))
            //     return res.send({data:getLongUrl})
            // }


           let url = await urlModel.findOne({longUrl:longUrl}).select({"createdAt":0,"updatedAt":0,"__v":0,"_id":0})
               if(url){
                   return res.status(409).send({status:false,msg:"Already Present",data:url})
               }else{
         //   // const urlCode = shortid.generate().toLowerCase();

          
         const urlCode = generate.random(options);
            // console.log(shortid);   
            let isUrlCodeIsPresent = await urlModel.findOne({
                urlCode: urlCode
            });

            if (isUrlCodeIsPresent) {
                return res.status(409).send({
                    status: false,
                    message: "Url code is already exists"
                })
            } else {

                let base = "http://localhost:3000";
                const shortUrl = `${base}/${urlCode}` //here it is not dividing it actually placing value after '/ // template literals

                let shortUrlPresent = await urlModel.findOne({
                    shortUrl: shortUrl
                });
                if (shortUrlPresent) {
                    return res.status(409).send({
                        status: false,
                        message: "Short Url is already present"
                    })
                } else {


                    let urlCreate = await urlModel.create({
                        urlCode,
                        longUrl,
                        shortUrl,

                    });

                    let toShow = {
                        longUrl: longUrl,
                        shortUrl: shortUrl,
                        urlCode: urlCode
                    }
                    await SET_ASYNC(`${urlCode}`, JSON.stringify(longUrl)); // save also in caching memory 

                    res.status(201).send({
                        status: true,
                        data: toShow
                    });
                }
            }
               }
        } else {
            return res.status(400).send({
                status: false,
                message: "Not a valid URL format"
            })
        }
    } catch (error) {
        res.status(500).send({
            status: false,
            message: error.message
        })
    }
}

const getUrlCode = async function (req, res) {


    let urlCode = req.params.urlCode;
    if (urlCode == "" || typeof urlCode == null || typeof urlCode == undefined) {
        return res.status(400).send({
            status: false,
            message: "Please valid Url Code"
        })
    }

    try {

        // let urlCodeIsPresent = await urlModel.findOne({
        //     urlCode: urlCode
        // })
        // // null is falsy value and in if condition it takes only true value so 
        // // when nothing is present it will give null and that is falsy so ! is reverse
        // // logic part to true move inside the code


        // if (!urlCodeIsPresent) {
        //     return res.status(404).send({
        //         status: false,
        //         msg: "Url is not present"
        //     });
        // }
        // console.log(urlCodeIsPresent.longUrl, urlCodeIsPresent.shortUrl);
        // return res.status(301).redirect(urlCodeIsPresent.longUrl)
        // return res.send({status:true,data:urlCodeIsPresent.longUrl})

        // let cachedUrl = await GET_ASYNC(`${urlCode}`);
        // console.log(cachedUrl);
        // if(cachedUrl){

        //     console.log("Hit");
        //     return res.status(301).redirect(JSON.parse(cachedUrl).longUrl)
        //     // return res.send({data:JSON.parse(cachedUrl).longUrl});
        // }else{
        //     console.log("Miss");
        //     let getUrl = await urlModel.findOne({urlCode:urlCode});
        //     console.log(getUrl);
        //     await SET_ASYNC(`${urlCode}`,JSON.stringify(getUrl.longUrl))
        //     console.log(getUrl.longUrl);
        //     return res.status(301).redirect(getUrl.longUrl)
        //     res.send({data:getUrl})
        // }

        let cachedUrl = await GET_ASYNC(`${urlCode}`)
        if(cachedUrl) {
            console.log("Hit");
            // res.redirect(cachedUrl)
            // console.log(cachedUrl);
            res.redirect(JSON.parse(cachedUrl))
            return
        //   res.send(cachedUrl)
        } else {
            console.log("Miss");
          let getUrl = await urlModel.findOne({urlCode:urlCode}).select({longUrl:1,_id:0});
          await SET_ASYNC(`${urlCode}`, JSON.stringify(getUrl.longUrl))
        //   console.log(`${urlCode}`,getUrl.longUrl);
        //   res.redirect(`${urlCode}`)
         
        return res.send({ data: urlCode });


        }


    } catch (err) {
        return res.status(500).send({
            message: err.message
        })
    }
}

module.exports.getUrlCode = getUrlCode
module.exports.createUrlShorter = createUrlShorter