let axios = require('axios');

const memes = async function(req,res){
    
    try{
    
    let text0 = req.query.text0;
    let text1 = req.query.text1;
    let template_id = req.query.template_id
    
    let options = {
        method:'post',
        url:`https://api.imgflip.com/caption_image?template_id=${template_id}&text0=${text0}&text1=${text1}&username=chewie12345&password=meme@123`

    }

    let result = await axios(options)
    let data = result.data;
    res.status(200).send({msg:data,status:true})
    }
    catch(err){
        console.log(err.message);
        res.send(err.message)
    }
}

module.exports.memes = memes;