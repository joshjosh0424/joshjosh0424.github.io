const express = require("express");
const routes = express.Router();

// session set the name
routes.route("/session_set_name/:name").get(async (req, res) => {
    try {
      req.session.name = req.params.name;
      res.json();
    } catch(err) {
      throw err;
    }
  })

// session get the name
routes.route("/session_get_name").get(async (req, res) => {
    try {
      const resultObj = { name: req.session.name };
      res.json(resultObj);
    } catch(err) {
      throw err;
    }
  })

// session delete
routes.route("/session_delete").get(async function (req, res) {
    req.session.destroy();
    let status = "session destroyed";
    const resultObj = { status: status };
    res.json(resultObj);
});

routes.route("/")

module.exports = routes;