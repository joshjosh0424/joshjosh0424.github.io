const express = require("express");
const routes = express.Router();

routes.route("/session_set").get(async function (req, res) {
    console.log("In /session_set, session is: " + req.session);
    let status = "Logged Out";
    if (!req.session.username) {
        req.session.username = "Josh";
        status = "Logged In";
        console.log(status);
    } else {
        status = "Logged In";
        console.log(status);
    }
    const resultObj = { status: status };

    res.json(resultObj);
});

routes.route("/session_delete").get(async function (req, res) {
    console.log("In /session_delete, session is: " + req.session);
    req.session.destroy();
    let status = "logged out";
   
    const resultObj = { status: status };

    res.json(resultObj);
});

module.exports = routes;