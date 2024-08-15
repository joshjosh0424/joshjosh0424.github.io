const express = require("express");
const dataRoutes = require("./routes/user");
const foodRoutes = require("./routes/food");

// Load express
const app = express();
const port = 3000;

// Routes in /routes/user
app.use("/user_routes", dataRoutes);
app.use("/food_routes", foodRoutes);

// Routes in this file
app.get("/", (req, res) => {
    res.send("hello, please add food.html or page.html into your browser after 3000/ to continue");
});

// this is the front end for now, next time we will use react
app.use(express.static('public'));

// Set up the server
app.listen(port, () => {
    console.log("Server started on port " + port);
});