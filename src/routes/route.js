const express = require('express');
const router = express.Router();

let players = []



router.post("/players", function (req, res) {
    let name = req.body.name;
    let isFound = false;
    for (let i = 0; i < players.length; i++) {
        if (name === players[i].name) {
            isFound = true;
        }
    }

    if (isFound === false) {
        players.push(req.body);
       
        res.send(players);
    } else {
        res.send("name is already present")
    }
   

});

router.post('/players/:playerName/bookings/:bookingId', function (req, res) {
   
    let nameParams = req.params.playerName;
    let isNamePresent = false;
   
    for (let i = 0; i < players.length; i++) {
        if (players[i].name==nameParams) {
            isNamePresent = true;
        }
    }

    if (!isNamePresent) {
        res.send('player not presenet')
    }

    let booking = req.body;
    let bookingIdParams = req.params.bookingId;
    for(let i=0;i<players.length;i++){
        if(players[i].name==nameParams){
          for (let j = 0; j < players[i].bookings.length; j++) {
               if (players[i].bookings[j].bookingNumber===bookingIdParams) {
                   return res.send('Booking alreasdy present');
               }
                
            }
           players[i].bookings.push(booking);
        }
      }

    
      res.send(players);

})

module.exports = router;

