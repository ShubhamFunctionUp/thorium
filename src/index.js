const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/routes.js');
const { default: mongoose } = require('mongoose');
const multer =require("multer")


const app = express();
app.use(multer().any())
// support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data -- when data we get from form
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://Shubh9638464483:bI1LiqgUI6ov0Jhb@cluster0.azzwg.mongodb.net/groupDatabase12?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.use('/', route);


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});