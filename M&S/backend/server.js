const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
require("dotenv").config({ path: "./config.env"});
const port = process.env.PORT;

app.use(
    cors({
        origin: "http://localhost:3000",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
        optionsSuccessStatus: 204,
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(session(
    {
        secret: 'keyboard cat',
        saveUninitialized: false, //dont create a session until something is stored
        resave: false, //dont save session if unmodified
        store: MongoStore.create({
            mongoUrl: process.env.ATLAS_URI
        })
    }
));

const dbo = require("./db/conn");
app.use(express.json());
app.use(require("./routes/record"));
app.use(require("./routes/session"));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(5000, () => {
    dbo.connectToServer(function(err) {
        if (err) {
        console.err(err);
        }
    });
    console.log(`server is running on port ${port}`);
});
