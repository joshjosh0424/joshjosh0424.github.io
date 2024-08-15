const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const app = express();
const port = process.env.PORT;

// Needed for sessions
const session = require("express-session");
const MongoStore = require("connect-mongo");

// Needed for cookies
app.use(cors(
    {
        origin: "http://localhost:3000",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
        optionsSuccessStatus: 204,
        allowedHeaders: ["Content-type", "Authorization"]
    }
));

// Session
app.use(session(
    {
        secret: 'keyboard cat',
        saveUninitialized: false, // dont't create sessions until something is stored
        resave: false,            // Dont save session if unmodified
        cookie: {expires: new Date(1586323351000), maxAge:31536000000},
        store: MongoStore.create({
            mongoUrl: process.env.ATLAS_URI
        })
    }
));

const dbo = require("./db/conn");
app.use(express.json());
app.use(require("./routes/data"));
app.use(require("./routes/session"))

app.listen(port, () => {
    dbo.connectToServer(function(err) {
        if (err) {
            console.err(err);
        }
    });
    console.log(`Server is running on port ${port}`);
});