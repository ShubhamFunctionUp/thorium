const URL = "www.google.com"

function welcome(name){
    console.log(`Welcome to my application. I am ${name} and a part of FunctionUp Thorium cohort`);
}

module.exports.URL = URL;
module.exports.welcome = welcome;