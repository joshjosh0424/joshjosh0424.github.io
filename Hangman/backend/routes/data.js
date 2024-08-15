const express = require("express");

const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This helps convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;


// here is the start of the session plus username setting
recordRoutes.route("/session_start").post(async (req, res) => {
    console.log("attempting to start session")
    try{
        const name = req.body.name;
    if (!name) {
        return res.status(301).json("You must input a username before playing.");
    }
    req.session.name = name;
    res.status(200).json("username has been set to session.");
    }
	catch (err) {
        return res.status(301).json("Error starting the game " + err);
        }   
});

recordRoutes.route("/random-word").get(async (req, res) => {
    try {
        console.log("Trying to connect to db");
        let db_connect = dbo.getDb();
        const collection = db_connect.collection("Words");

        const count = await collection.countDocuments();
        if (count === 0) {
            return res.status(404).json({ message: 'No words found' });
        }

        const randomIndex = Math.floor(Math.random() * count);

        const randomWord = await collection.find().skip(randomIndex).limit(1).toArray();
        randomWord[0].word = randomWord[0].word.toLowerCase();
        res.json(randomWord[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// here is the deletion of the session
recordRoutes.route("/session_end").get(async (req, res) => {
	req.session.destroy();
	let status = "session destroyed";
	const resultObj = { status: status };
	res.json(resultObj);
});


recordRoutes.route("/highscores").get(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        const collection = db_connect.collection("Highscores");

        const highscore = await collection.find({}).toArray();
        res.json(highscore);
        console.log("Connected to db");
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

recordRoutes.route("/highscores/add").post(function (req, response) {
    let db_connect = dbo.getDb();
    let newvalues = {
        numLetters: req.body.numLetters,
        score: req.body.score,
        player: req.body.player
    };
    db_connect.collection("Highscores").insertOne(newvalues, function (err, res) {
        if (err) throw err;
        response.json(res);
      });
   });

module.exports = recordRoutes;
