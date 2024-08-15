require("dotenv").config({ path: "./config.env" });
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.ATLAS_URI;

let _db;
module.exports = {
    connectToServer: function (callback) {
        console.log("Attempting to connect to MongoDB...");

        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true
            }
        });

        async function run() {
            try {
                await client.connect();
                console.log("MongoDB client connected.");
        
                await client.db("admin").command({ ping: 1 });
                console.log("Pinged your deployment.");

                _db = client.db("BankData");
                console.log("Successful connection to the BankData collection.");
            } catch (err) {
                console.error("Failed to connect to MongoDB:", err);
            } finally {
                //console.log("Closing the client")
                //await client.close();
            }
        }
        run().catch(console.dir);
    },
    getDb: function() {
        if (!_db) {
            console.log("Database not initialized");
            throw new Error("Database not initialized");
        }
        return _db;
    }
}
