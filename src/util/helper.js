function printDate() {
  const d = new Date();
  console.log(d.getDate());
   
}

function printMonth() {
  const month = new Date();
  console.log(month.getMonth());
  
}

function getBatchInfo() {
  const d = new Date();
  var oneJan = new Date(d.getFullYear(), 0, 1);
  var numberOfDays = Math.floor((d - oneJan) / (24 * 60 * 60 * 1000));
  var result = Math.ceil((d.getDay() + 1 + numberOfDays) / 7);
  console.log(`The week number of the current date (${d}) is ${result}.`);
  // const week =d.getWeek() ;
  const day = d.getDay();
  const batch = "Thorium, W3D1, the topic for today is Nodejs module system";
  console.log(batch, day, result);
 
}
module.exports.printDate = printDate;
module.exports.printMonth = printMonth;
module.exports.getBatchInfo = getBatchInfo;
