const express = require('express');
const app = express();

const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config({ path : "./config.env"});

app.use(cors());
app.use(express.json());

const dbo = require("./db/conn");

app.use(require("./routes/data"));

const port = process.env.PORT;

// Start the server after database connection
dbo.connectToServer((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
