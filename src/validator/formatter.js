function triming (message){
    let store  = message.trim();
    console.log(store);
}

function lowerCase(message) {
    let lower = message.toLowerCase();
    console.log(lower);
}

function upperCase(message){
    let upper = message.toUpperCase();
    console.log(upper);
}

module.exports.triming = triming;
module.exports.lowerCase = lowerCase;
module.exports.upperCase = upperCase;