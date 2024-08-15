const express = require("express");
const sessionRoutes = express.Router();

// session_set route
sessionRoutes.route("/session_set/:email").post(async function(req, res) {  
    console.log(`In session_set`);  
    let status = "";
    if (!req.session.username) {
        req.session.username = req.params.email;
        status = req.session.username;
    } else {
        status = req.session.username;
    }
    const resultObj = {status: status};
    console.log(resultObj);
    res.json(resultObj);
});

// session_get route
sessionRoutes.route("/session_get").get(async function(req, res) {
    console.log(`In session_get`);
    let status = "";
    if (!req.session.username) {
        status = "No session set";
    } else {
        status = req.session.username;
    }
    console.log(status);
    res.json(status);
});

// session_delete route
sessionRoutes.route("/session_delete").get(async function(req, res) {
    console.log(`In session_delete`);
    req.session.destroy();
    let status = "No session set";
    const resultObj = {status: status};
    console.log(resultObj);
    res.json(resultObj);
});


module.exports = sessionRoutes;