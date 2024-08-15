const express = require("express");
const myCustomRoutes = require("./routes/user");

// Load express
const app = express();
const port = 3000;

// Routes in /routes/user
app.use("/user_routes", myCustomRoutes);

// Routes in this file
app.get("/", (req, res) => {
    res.send("hello,World!");
});

// this is the front end for now, next time we will use react
app.use(express.static('public'));

// Set up the server
app.listen(port, () => {
    console.log("Server started on port " + port);
});