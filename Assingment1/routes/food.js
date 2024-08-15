const express = require("express");
const fs = require("node:fs");
const router = express.Router();

router.get("/", (req, res) => {
    const foodList = req.query.foodList;
    const data = fs.readFileSync("data.text", 
        {encoding: 'utf8', flag: 'r'});
    var table = ""

    const rows = data.split(' ');
    for (var i = 0; i < rows.length-1; i++) {
        var cells = rows[i].split(',');
        if (cells[2] == foodList) {
          var tableRow = `<tr><td>${cells[0]}</td><td>${cells[1]}</td><td>${cells[2]}</td></tr>\n`
          table += tableRow;
        }
    }

    res.send(
        `<html>
        <head></head>
        <body> 
            <p>Food You Searched For: ${foodList} </p>
            <p>Results:</p>
            <table> ${table} </table>
        </body>
        </html>`
    )
});

module.exports = router;