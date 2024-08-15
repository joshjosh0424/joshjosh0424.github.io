const express = require("express");

const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This helps convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// This section will create some data.
recordRoutes.route("/data/add").post(async (req, res) => {
    //console.log(req.body.last, req.body.first);
    try {
        console.log("did it connect?");
        let db_connect = dbo.getDb();
        console.log(db_connect);
        console.log("db_connect worked");
        let myobj = {
            last: req.body.last,
            first: req.body.first,
        };
        const result = await db_connect.collection("records").insertOne(myobj);
        //console.log(result);
        res.json(result);
    } catch (err) {
        throw err;
    }
});

// This section will get a list of all the records.
recordRoutes.route("/data").get(async (req, res) => {
    try {
        console.log("In record get route");
        let db_connect = dbo.getDb();
        const result = await db_connect.collection("records").find({}).toArray();
        console.log("got result");
        res.json(result);
    }
    catch (err) {
        throw err;
    }
});

module.exports = recordRoutes;
