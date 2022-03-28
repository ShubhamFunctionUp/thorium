const bookModel = require('../models/bookModel');

const createBook = async function(req,res){
    let data = req.body;
    if(Object.keys(data)==0){
        return res.send({status:false,msg:"Please insert data"});
    }
    let{title} = data;
    let isBookPresent = await bookModel.findOne({title:title});
    if(isBookPresent!=null){
        return res.send({msg:"book is already present"})
    }

    const cd = new Date();
    const releasedAt = `${cd.getFullYear()}/${cd.getMonth()}/${cd.getDate()}`;
    console.log(releasedAt);
    data.releasedAt = releasedAt;

    let entryCreated = await bookModel.create(data);
    return res.send({status:true,data:entryCreated});
}

const findBook = async function(req,res){
    let data= req.query;
    if (Object.keys(data).length===0) {
    let isNotDeleted = await bookModel.find({isDeleted:false}).select({book_id:1,title:1,excerpt:1,userId:1,category:1,releasedAt:1,reviews:1})
    if(isNotDeleted.length===0){
        return res.send({msg:"not data is present"});
    }
    return res.send({msg:isNotDeleted});
}
   else{
  
    let filter = {
        ...data
    }
    let findFilterBook = await bookModel.find(filter).sort({title:1});

    return res.send({msg:findFilterBook});
}
}   
module.exports.findBook = findBook;
module.exports.createBook = createBook;