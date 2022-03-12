const axios = require('axios');

const weatherApi = async function (req,res){
 try{
    const cities=   ["Bengaluru","Mumbai", "Delhi", "Kolkata", "Chennai", "London", "Moscow"];
    let cityArr = [];
    for (let i = 0; i < cities.length; i++) {
        let obj = {
            city:cities[i]
        }
        let result =await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${cities[i]}&appid=c5a07a5f1ba8b10f0e5cb28b018f097a`)
        console.log(result.data.main);
        obj.temp = result.data.main.temp;
        cityArr.push(obj);
    }

    let sorted = cityArr.sort(function(a,b){
        return a.temp - b.temp;
    })

    res.status(200).send({status:true,data:sorted})
 }
 catch(err){
     res.status(400).send(err.message)
 }
}

module.exports.weatherApi = weatherApi;