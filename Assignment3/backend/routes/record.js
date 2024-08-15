const express = require("express");


// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();


// This will help us connect to the database
const dbo = require("../db/conn");


// This helps convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

 
// This section will help you create a new bank account.
recordRoutes.route("/record/add").post(async (req, res) => {
    /// console.log(req);
    try {
        let db_connect = dbo.getDb();
        let myobj = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            phone_num: req.body.phone_num,
            password: req.body.password,
            role: req.body.role || "",
            checking: req.body.checking || 0,
            savings: req.body.savings || 0,
        };
        const result = await db_connect.collection("records").insertOne(myobj);
        console.log("1 Account Inserted")
        res.json(result);
    } catch (err) {
        throw err;
    }
});
 
// this will check if a given email address / password pair matches one found in 
// the data store. If so, returns a successful message, otherwise returns a failure message.


// Retrieves all user accounts. Also displays their role. Also their checkings and savings amounts. 
// Does not display passwords. 
recordRoutes.route("/record").get(async (req, res) => {
    try{
        console.log("In record get route");
        let db_connect = dbo.getDb("accounts");
        const result = await db_connect.collection("records").find({}).toArray();
        console.log("got reslut");
        res.json(result);
    } 
    catch (err) {
    throw err;
    }   
});


// Displays all information for one particular account associated with an email address. Do not show the password.
recordRoutes.route("/record/:email").get(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email};
        const result = await db_connect.collection("records").findOne(myquery);
        res.json(result);
    } 
    catch (err) {
    throw err;
    }
});


//Updates an account related to an email address one of the following three roles: customer, manager, administrator.
recordRoutes.route("/update/:email").put(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email};
        let newvalues = {
          $set: {
            role: req.body.role,
          },
        };
        const result = db_connect.collection("records").updateOne(myquery, newvalues);
        console.log("1 Document Updated");
        res.json(result);
    }
    catch (err) {
    throw err
    };
});


// Deposits money into the account related to an email address. The deposit must specify savings or checking.
recordRoutes.route("/deposit/:email").put(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email };
        let deposit = { amount: req.body.amount };
        const account = await db_connect.collection("records").findOne(myquery);
        const account_type = req.body.savings
        let current_balance = account[account_type];
        let sum = parseInt(current_balance + deposit);
        let newvalues = {
          $set: {
            savings: req.body.savings || sum,
          },
        };
        const result = db_connect.collection("records").updateOne(myquery, newvalues);
        console.log("savings Updated");
        res.json(result);
    }
    catch (err) {
    throw err
    };
});


// Withdraws money from a checking or savings account related to an email address. The withdrawal cannot go below 0. 
// If a request is made to withdraw more money than exists, do not compute anything. If the withdrawal is 
// successful return a successful message. Otherwise return a failure message.
recordRoutes.route("/withdraw/:email").put(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email};
        let newvalues = {
          $set: {
            email: req.body.email,
            role: req.body.role,
          },
        };
        const result = db_connect.collection("records").updateOne(myquery, newvalues);
        console.log("1 Document Updated");
        res.json(result);
    }
    catch (err) {
    throw err
    };
});


// Transfers money from checking/savings to the other checkings/savings within an account associated with an email 
// address. Does not transfer to other user accounts. Like before, the transfer cannot exceed funds. If the 
// withdrawal is successful return a successful message. Otherwise return a failure messages.
recordRoutes.route("/transfer/:email").put(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email};
        let newvalues = {
          $set: {
            email: req.body.email,
            role: req.body.role,
          },
        };
        const result = db_connect.collection("records").updateOne(myquery, newvalues);
        console.log("1 Document Updated");
        res.json(result);
    }
    catch (err) {
    throw err
    };
});


module.exports = recordRoutes;