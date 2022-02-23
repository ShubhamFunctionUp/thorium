const express = require('express');
const router = express.Router();

router.get('/students/:name', function (req, res) {
    let studentName = req.params.name
    console.log(studentName)
    res.send(studentName)
})

// 1. This API will fetch all movies array

router.get('/movies', function (req, res) {
    let movies = ["KKHH", "DDLJ", "Fanna", "Fan", "3 Idiot", "Mann"];

    res.send(movies)
});

// This API will fetch all movie by indexId from array

router.get('/movies/:movieId', function (req, res) {
    let mov = ["KKHH", "DDLJ", "Fanna", "Fan", "3 Idiot", "Mann"];
    let value = req.params.movieId;
    if (value > mov.length - 1) {
        res.send("Doesn't exist");
    } else {
        res.send(mov[value])
    }
})

// 3.This API will fetch all movies from array all object
router.get('/films', function (req, res) {
    let obj = [
        { "id": 1, "name": "Fanna" },
        { "id": 2, "name": "Rang de Basanti" },
        { "id": 3, "name": "Hello Brother" },
        { "id": 4, "name": "Mera mann" }
    ]
    res.send(obj);
});

// 4. This API will fetch all movies from array of objects by indexId

router.get('/films/:filmId', function (req, res) {
    let movi = [
        { id: 1, name: "Fanna" },
        { id: 2, name: "Rang de Basanti" },
        { id: 3, name: "Hello Brother" },
        { id: 4, name: "Mera mann" }
    ];

    let value = req.params.filmId;
    // console.log(typeof value);

    let found = false;
    for (let i = 0; i < movi.length; i++) {
        // console.log(movi[i]);
        // console.log(movi[i].id == value);
        if (movi[i].id == value) {
            found = true;
            res.send(movi[i]);
            break;
        }
    }
    if (found === false) {
        res.send("No movie exists with this Id");
    }
})


module.exports = router;
