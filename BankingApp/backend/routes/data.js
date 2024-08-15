const express = require("express");
const dataRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

// Getting all data within accounts
dataRoutes.route("/data").get(async (req, res) => {
    try{
        let db_connect = dbo.getDb();
        const result = await db_connect.collection("Accounts").find({}).toArray();
        res.json(result);
    } catch (err) {
        res.status(500).json("Error within get data route");
    }
});

// Getting account data (excluding ids and passwords)
dataRoutes.route("/accounts").get(async (req, res) => {
    try{
        let db_connect = dbo.getDb();
        const result = await db_connect.collection("Accounts").find({}).project({ _id:0, password:0 }).toArray();
        res.json(result);
    } catch (err) {
        res.status(500).json("Error within get accounts route");
    }
});

// Getting all data associated with given email (excluding id and password)
dataRoutes.route("/accounts/:email").get(async (req, res) => {
    try{
        let db_connect = dbo.getDb();
        let query = {emailAddress: req.params.email};
        const result = await db_connect.collection("Accounts").find(query).project({ _id:0, password:0 }).toArray();
        res.json(result);
    } catch (err) {
        res.status(500).json("Error within get accounts via email route");
    }
});

// Adding a new account to the BankData and confirming no duplicate email addresses
dataRoutes.route("/accounts/add").post(async (req, res) => {
    try{
        let db_connect = dbo.getDb();
        const result = await db_connect.collection("Accounts").find({ emailAddress: req.body.emailAddress }).count();
        const memberTotal = await db_connect.collection("Accounts").find().count();

        // Check for dublicate Email
        if (result > 0) {
            console.log(`Unable to insert account because of duplicate Email Address: ${req.body.emailAddress}`);
            throw err;
        } else {
            let newAccount = {
                firstName: req.body.firstName,
                LastName: req.body.lastName,
                emailAddress: req.body.emailAddress,
                phoneNumber: req.body.phoneNumber,
                role: "Customer",
                memberId: (memberTotal+1),
                savings: 0,
                checking: 0,
                investment: 0,
                password: req.body.password
            }
            const result = db_connect.collection("Accounts").insertOne(newAccount);
            console.log("Successfully added Account");
            res.json(result);
        }
    } catch (err) {
        res.status(500).json("Error within accounts add route");
    }
});

// Update account role associated with the given email address
dataRoutes.route("/update/role").post(async (req, res) => {
    try{
        let db_connect = dbo.getDb();
        let query = {emailAddress: req.body.email};
        let newRole = req.body.role;
        
        // Check given role
        if (newRole != "Customer" && newRole != "Administrator" && newRole != "Employee") {
            console.log(`Cannot give role ${newRole}`);
            throw err;
        } else {
            let updatedRole = {
                $set: {
                    role: req.body.role
                }
            }
            const result = await db_connect.collection("Accounts").updateOne(query, updatedRole);
            console.log(`Successfully updated Role for ${req.body.email}`);
            console.log(`Successfully updated Role for ${req.body.role}`);
            res.json(result);
        }
    } catch (err) {
        res.status(500).json("Error within update role route");
    }
});

// Deposit amount in account associated with the given email address
dataRoutes.route("/deposit/:email").post(async (req, res) => {
    try{
        let db_connect = dbo.getDb();
        let query = {emailAddress: req.params.email};
        let amount = parseFloat(req.body.deposit) * 100;
        // Be careful when passing account name
        let toAccount = req.body.accountType;

        // Deposit into Savings
        if (toAccount == "Savings") {
            let result = await db_connect.collection("Accounts").updateOne(query, {$inc: {savings: amount}});
            console.log(`Successfully deposited Savings for ${req.params.email}`);
            res.json(result);
        // Deposit into Checking
        } else if (toAccount == "Checking") {
            let result = await db_connect.collection("Accounts").updateOne(query, {$inc: {checking: amount}});
            console.log(`Successfully deposited Checking for ${req.params.email}`);
            res.json(result);
        // Deposit into Investment
        } else if (toAccount == "Investment"){
            let result = await db_connect.collection("Accounts").updateOne(query, {$inc: {investment: amount}});
            console.log(`Successfully deposited Investment for ${req.params.email}`);
            res.json(result);
        // Account type not found
        } else {
            console.log(`Cannot deposit money into account ${toAccount}`);
            throw err;
        }
        
    } catch (err) {
        res.status(500).json("Error within deposit route");
    }
});

// Withdraw amount in account associated with the given email address
dataRoutes.route("/withdraw/:email").post(async (req, res) => {
    try{
        let db_connect = dbo.getDb();
        let query = {emailAddress: req.params.email};
        let newWithdraw = parseFloat(req.body.withdraw) * 100;
         // Be careful when passing account name
        let fromAccount = req.body.accountType;

        // Withdraw from Savings
        if (fromAccount == "Savings") {
            let currentBalance = await db_connect.collection("Accounts").find(query).project({ savings: 1 }).toArray();
            if (currentBalance[0].savings - newWithdraw > -1) {
                let newBalance = {
                    $set: {
                        savings: (currentBalance[0].savings - newWithdraw)
                    }
                }
                let result = await db_connect.collection("Accounts").updateOne(query, newBalance);
                console.log(`Successfully withdrew Savings for ${req.params.email}`);
                res.json(result);
                
            } else {
                console.log(`Cannot withdraw from Savings. Current Balance: ${currentBalance[0].savings}`);
                throw err;
            }
        // Withdraw from Checking
        } else if (fromAccount == "Checking") {
            let currentBalance = await db_connect.collection("Accounts").find(query).project({ checking: 1 }).toArray();
            if (currentBalance[0].checking - newWithdraw > -1) {
                let newBalance = {
                    $set: {
                        checking: (currentBalance[0].checking - newWithdraw)
                    }
                }
                db_connect.collection("Accounts").updateOne(query, newBalance);
                let result = await db_connect.collection("Accounts").updateOne(query, newBalance);
                console.log(`Successfully withdrew Checking for ${req.params.email}`);
                res.json(result);               
            } else {
                console.log(`Cannot withdraw from Checking. Current Balance: ${currentBalance[0].checking}`);
                throw err;
            }
        // Withdraw from Investment
        } else if (fromAccount == "Investment") {
            let currentBalance = await db_connect.collection("Accounts").find(query).project({ investment: 1 }).toArray();
            if (currentBalance[0].investment - newWithdraw < 0) {
                console.log(`Cannot withdraw from Investment. Current Balance: ${currentBalance[0].investment}`);
                throw err;
            } else {
                let newBalance = {
                    $set: {
                        investment: (currentBalance[0].investment - newWithdraw)
                    }
                }
                db_connect.collection("Accounts").updateOne(query, newBalance);
                let result = await db_connect.collection("Accounts").updateOne(query, newBalance);
                console.log(`Successfully withdrew Investment for ${req.params.email}`);
                res.json(result);
            }
        // Account type not found
        } else {
            console.log(`Cannot withdraw money from account ${fromAccount}`);
            throw err;
        }
    } catch (err) {
        res.status(500).json("Error within the withdraw route");
    }
});

// Transfer amounts between acounts of different users 
dataRoutes.route("/transfer").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        // For first account
        let query = {memberId: parseInt(req.body.memberID1)};
         // Be careful when passing account name
        let fromAccount = req.body.fromAccount
        console.log(req.body.fromAccount);
        // For second account
        let query2 = {memberId: parseInt(req.body.memberID2)};
        // Be careful when passing account name
        let toAccount = req.body.toAccount;
        let amount = parseFloat(req.body.transfer) * 100;
        
        // Transfer from Savings
        if (fromAccount === "Savings") {
            let currentBalance = await db_connect.collection("Accounts").find(query).project({ savings: 1 }).toArray();

            // Checking Balances and showing amounts
            console.log("From account is Savings");
            console.log("Current balance of Savings:", currentBalance);
            console.log("Amount being Transfered: ", amount);

            if (currentBalance[0].savings > amount) {
                console.log("If Current balance is Greater than Amount being transfered");
                let newBalance = {
                    $set: {
                        savings: (currentBalance[0].savings - amount)
                    }
                }
                console.log("Updated Savings Account");

                // Transfer into Checking
                if (toAccount === "Checking") {
                    console.log("Transfering to Checking...")
                    db_connect.collection("Accounts").updateOne(query2, {$inc: {checking: amount}});
                // Transfer into Investment
                } else if (toAccount === "Investment") {
                    console.log("Transfering to Investment...")
                    db_connect.collection("Accounts").updateOne(query2, {$inc: {investment: amount}});
                // Account not found
                } else {
                    console.log(`Cannot transfer into account ${toAccount.charAt(0).toUpperCase() + toAccount.slice(1)} for ${req.body.memberID2}`);
                    throw err;
                }

                let result = await db_connect.collection("Accounts").updateOne(query, newBalance);
                console.log(`Successfully transfered funds from Savings to ${toAccount} for ${req.body.memberID1}}`);
                res.json(result);

            } else {
                console.log(`Cannot transfer from Savings. Current Balance: ${currentBalance[0].savings}`);
                throw err;
            }
        // Transfer from Checking
        } else if (fromAccount === "Checking") {
            let currentBalance = await db_connect.collection("Accounts").find(query).project({ checking: 1 }).toArray();

            // Checking Balances and showing amounts
            console.log("From account is Checking");
            console.log("Current balance of Checking:", currentBalance);
            console.log("Amount being Transfered: ", amount);

            if (currentBalance[0].checking > amount) {
                let newBalance = {
                    $set: {
                        checking: (currentBalance[0].checking - amount)
                    }
                }
                console.log("Updated Checking Account");

                // Transfer into Savings
                if (toAccount == "Savings") {
                    console.log("Transfering to Savings")
                    db_connect.collection("Accounts").updateOne(query2, {$inc: {savings: amount}});
                // Transfer into Investment
                } else if (toAccount === "Investment") {
                    console.log("Transfering to Investment")
                    db_connect.collection("Accounts").updateOne(query2, {$inc: {investment: amount}});
                // Account not found
                } else {
                    console.log(`Cannot transfer into account ${toAccount.charAt(0).toUpperCase() + toAccount.slice(1)} for ${req.body.memberID2}`);
                    throw err;
                }

                let result = await db_connect.collection("Accounts").updateOne(query, newBalance);
                console.log(`Successfully transfered funds from Checking to ${toAccount} for ${req.body.memberID1}`);
                res.json(result);

            } else {
                console.log(`Cannot transfer from Checking. Current Balance: ${currentBalance[0].checking}`);
                throw err;   
            }
        } else if (fromAccount === "Investment") {
            let currentBalance = await db_connect.collection("Accounts").find(query).project({ investment: 1 }).toArray();

            if (currentBalance[0].investment > amount) {
                let newBalance = {
                    $set: {
                        investment: (currentBalance[0].investment - amount)
                    }
                }
                console.log("Updated Investment Account");

                // Checking Balances and showing amounts
                console.log("From account is Investment");
                console.log("Current balance of Investment:", currentBalance);
                console.log("Amount being Transfered: ", amount);

                // Transfer into Savings
                if (toAccount == "Savings") {
                    console.log("Transfering to Savings")
                    db_connect.collection("Accounts").updateOne(query2, {$inc: {savings: amount}});
                // Transfer into Checking
                } else if (toAccount === "Checking") {
                    console.log("Transfering to Checking")
                    db_connect.collection("Accounts").updateOne(query2, {$inc: {checking: amount}});
                // Account not found
                } else {
                    console.log(`Cannot transfer into account ${toAccount.charAt(0).toUpperCase() + toAccount.slice(1)} for ${req.body.memberID2}`);
                    throw err;
                }
                let result = await db_connect.collection("Accounts").updateOne(query, newBalance);
                console.log(`Successfully transfered funds from Investment to ${toAccount} for ${req.body.memberID2}`);
                res.json(result);
            } else {
                console.log(`Cannot transfer from Investment. Current Balance: ${currentBalance[0].investment}`);
                throw err;
            }
        } else {
            console.log(`Cannot transfer money with account ${fromAccount}`);
            throw err;
        }
        
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Transfer amounts between Checking, Savings, or Investment associated with the given email address 
dataRoutes.route("/transfer/:email").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let query = {emailAddress: req.params.email};
        let amount = parseFloat(req.body.transfer) * 100;
         // Be careful when passing account name
        let fromAccount = req.body.fromAccount;
        let toAccount = req.body.toAccount;
        
        // Transfer from Savings
        if (fromAccount == "Savings") {
            let currentBalance = await db_connect.collection("Accounts").find(query).project({ savings: 1 }).toArray();

            // Checking Balances and showing amounts
            console.log("From account is Savings");
            console.log("Current balance of Savings:", currentBalance);
            console.log("Amount being Transfered: ", amount);

            if (currentBalance[0].savings > amount) {
                console.log("If Current balance is Greater than Amount being transfered");
                let newBalance = {
                    $set: {
                        savings: (currentBalance[0].savings - amount)
                    }
                }
                console.log("Updated Savings Account");

                // Transfer into Checking
                if (toAccount == "Checking") {
                    console.log("Transfering to Checking...")
                    db_connect.collection("Accounts").updateOne(query, {$inc: {checking: amount}});
                // Transfer into Investment
                } else if (toAccount == "Investment") {
                    console.log("Transfering to Investment...")
                    db_connect.collection("Accounts").updateOne(query, {$inc: {investment: amount}});
                // Account not found
                } else {
                    console.log(`Cannot transfer into account ${toAccount.charAt(0).toUpperCase() + toAccount.slice(1)}`);
                    throw err;
                }

                let result = await db_connect.collection("Accounts").updateOne(query, newBalance);
                console.log(`Successfully transfered funds from Savings to ${toAccount} for ${req.params.email}`);
                res.json(result);

            } else {
                console.log(`Cannot transfer from Savings. Current Balance: ${currentBalance[0].savings}`);
                throw err;
            }
        // Transfer from Checking
        } else if (fromAccount == "Checking") {
            let currentBalance = await db_connect.collection("Accounts").find(query).project({ checking: 1 }).toArray();

            // Checking Balances and showing amounts
            console.log("From account is Checking");
            console.log("Current balance of Checking:", currentBalance);
            console.log("Amount being Transfered: ", amount);

            if (currentBalance[0].checking > amount) {
                let newBalance = {
                    $set: {
                        checking: (currentBalance[0].checking - amount)
                    }
                }
                console.log("Updated Checking Account");

                // Transfer into Savings
                if (toAccount == "Savings") {
                    console.log("Transfering to Savings")
                    db_connect.collection("Accounts").updateOne(query, {$inc: {savings: amount}});
                // Transfer into Investment
                } else if (toAccount == "Investment") {
                    console.log("Transfering to Investment")
                    db_connect.collection("Accounts").updateOne(query, {$inc: {investment: amount}});
                // Account not found
                } else {
                    console.log(`Cannot transfer into account ${toAccount}`);
                    throw err;
                }

                let result = await db_connect.collection("Accounts").updateOne(query, newBalance);
                console.log(`Successfully transfered funds from Checking to ${toAccount} for ${req.params.email}`);
                res.json(result);

            } else {
                console.log(`Cannot transfer from Checking. Current Balance: ${currentBalance[0].checking}`);
                throw err;   
            }
        } else if (fromAccount == "Investment") {
            let currentBalance = await db_connect.collection("Accounts").find(query).project({ investment: 1 }).toArray();

            if (currentBalance[0].investment > amount) {
                let newBalance = {
                    $set: {
                        investment: (currentBalance[0].investment - amount)
                    }
                }
                console.log("Updated Investment Account");

                // Checking Balances and showing amounts
                console.log("From account is Investment");
                console.log("Current balance of Investment:", currentBalance);
                console.log("Amount being Transfered: ", amount);

                // Transfer into Savings
                if (toAccount == "Savings") {
                    console.log("Transfering to Savings")
                    db_connect.collection("Accounts").updateOne(query, {$inc: {savings: amount}});
                // Transfer into Checking
                } else if (toAccount == "Checking") {
                    console.log("Transfering to Checking")
                    db_connect.collection("Accounts").updateOne(query, {$inc: {checking: amount}});
                // Account not found
                } else {
                    console.log(`Cannot transfer into account ${toAccount}`);
                    throw err;
                }
                let result = await db_connect.collection("Accounts").updateOne(query, newBalance);
                console.log(`Successfully updated Investment balance for ${req.params.email}`);
                res.json(result);
            } else {
                console.log(`Cannot transfer from Investment. Current Balance: ${currentBalance[0].investment}`);
                throw err;
            }
        } else {
            console.log(`Cannot transfer money with account ${fromAccount}`);
            throw err;
        }
        
    } catch (err) {
        res.status(500).json("Error within the tranfer/email route");
    }
});

// Checking Email and Password to check account
dataRoutes.route("/check").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let query = {emailAddress: req.body.email};
        let emailPass = await db_connect.collection("Accounts").find(query).project({password: 1 }).toArray();
        // Check if Email associated Password matches given Password
        if (emailPass[0] && emailPass[0].password == req.body.password) {
            console.log(`Account found, Email Address: ${req.body.email}`);
            res.json(true);
        } else {
            console.log(`Account ${req.body.email} not found`);
            res.json(false);
        }
    } catch (err) {
        res.status(500).json("Error within the check route");
    }
});

// Getting all transaction history within the database
dataRoutes.route("/history").get(async (req, res) => {
    try{
        let db_connect = dbo.getDb();
        const result = await db_connect.collection("History").find({}).toArray();
        res.json(result);
    } catch (err) {
        res.status(500).json("Error within get history route");
    }
});

// Getting transaction history associated with the given email address 
dataRoutes.route("/history/:email").get(async (req, res) => {
    try{
        let db_connect = dbo.getDb();
        let query = {emailAddress: req.params.email};
        const result = await db_connect.collection("History").find(query).toArray();
        res.json(result);
    } catch (err) {
        res.status(500).json("Error within get history via email route");
    }
});

// Adding to history collection
dataRoutes.route("/history/add").post(async (req, res) => {
    try{
        
        let type = req.body.accountType;
        let currentDate = new Date();
        let db_connect = dbo.getDb();
        if (type === "TransferWithin") {
            let newRecord = {
                emailAddress: req.body.emailAddress,
                action: {
                    type: "TransferWithin",
                    toAccount: req.body.toAccount,
                    fromAccount: req.body.fromAccount,
                    amount: req.body.amount
                },
                date: currentDate
            }
            const result = db_connect.collection("History").insertOne(newRecord);
            console.log("Successfully added History record");
            res.json(result);
        } else if (type === "TransferOutside"){
            let newRecord = {
                fromUser: req.body.fromUser,
                action: {
                    type: "TransferOutside",
                    toUser: req.body.toUser,
                    toAccount: req.body.toAccount,
                    fromAccount: req.body.fromAccount,
                    amount: req.body.amount
                },
                date: currentDate
            }
            const result = db_connect.collection("History").insertOne(newRecord);
            console.log("Successfully added History record");
            res.json(result);
        }else if (type === "Withdraw") {
            let newRecord = {
                emailAddress: req.body.emailAddress,
                action: {
                    type: "Withdraw",
                    fromAccount: req.body.fromAccount,
                    amount: req.body.amount
                },
                date: currentDate
            }
            const result = db_connect.collection("History").insertOne(newRecord);
            console.log("Successfully added History record");
            res.json(result);
        } else if (type === "Deposit") {
            
            let newRecord = {
                emailAddress: req.body.emailAddress,
                action: {
                    type: "Deposit",
                    toAccount: req.body.toAccount,
                    amount: req.body.amount
                },
                date: currentDate
            }
            const result = db_connect.collection("History").insertOne(newRecord);
            console.log("Successfully added History record");
            res.json(result);
        }
        
    } catch (err) {
        res.status(500).json("Error within history add route");
    }
});


module.exports = dataRoutes;