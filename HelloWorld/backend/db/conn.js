const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config({ path: "./config.env" });
const uri = process.env.ATLAS_URI;
let _db;

module.exports = {
  connectToServer: function (callback) {
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });

    async function run() {
      try {
        console.log("Attempting to connect to MongoDB...");
        
        await client.connect();
        console.log("MongoDB client connected.");

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        _db = client.db("employees");
        console.log("Successful connection to employees collection.");

        callback(null);
      } catch (err) {
        console.error("Failed to connect to MongoDB:", err);
        callback(err);
      }
    }

    run().catch(err => {
      console.error("Error in run():", err);
      callback(err);
    });
  },

  getDb: function () {
    if (!_db) {
      console.error("Database not initialized");
      throw new Error("Database not initialized");
    }
    return _db;
  }
};