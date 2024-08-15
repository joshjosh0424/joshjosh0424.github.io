const express = require("express");
const fs = require("node:fs");
const router = express.Router();

router.get("/", (req, res) => {

    const teamname = req.query.teamname;
    const sport = req.query.sport;
    const content = teamname + ", " + sport;
    fs.appendFile("mydata.text", content, err => {
        if (err) {
            console.err(err);
        }
    })
    // generally this is not how returned data will be diplayed
    // instead a json object would be returned and then some front 
    // end would diplay it in a pretty way. This is trashy.
    res.send(
        "<html><head></head><body>" +
        "<p>Thank you for: " + req.query.teamname +
        "in sport: " + req.query.sport + "</p>" +
        "</body></html>"
    )
});

module.exports = router;