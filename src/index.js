const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/routes.js');
const { default: mongoose } = require('mongoose');
const multer =require("multer")


const app = express();
app.use(multer().any())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://Pooja1010:JfnE38uRPOS0bajB@cluster0.zsuwb.mongodb.net/Product-Management", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.use('/', route);


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});