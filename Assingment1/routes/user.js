const express = require("express");
const fs = require("node:fs");
const router = express.Router();
fs.closeSync(fs.openSync("data.text", "w"));

router.get("/", (req, res) => {

    const content = `${req.query.first},${req.query.last},${req.query.food} `
    const data = fs.readFileSync("data.text", {encoding: 'utf8', flag: 'r' });

    fs.appendFile("data.text", content, err => {
        if (err) {
            console.err(err);
        }
    })

    var table = ""

    const rows = data.split(' ');
    for (var i = 0; i < rows.length-1; i++) {
      var cells = rows[i].split(',');
      var tableRow = `<tr><td>${cells[0]}</td><td>${cells[1]}</td><td>${cells[2]}</td></tr>\n`
      table += tableRow;
    }
      table += `<tr><td>${req.query.first}</td><td>${req.query.last}</td><td>${req.query.food}</td></tr>\n`

    res.send(
        `<html>
        <body>
        <head></head>
        <table> 
            ${table} 
        </table>
        </body>
        </html>`
    )
});

module.exports = router;