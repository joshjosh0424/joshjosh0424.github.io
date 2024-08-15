import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function TransferBetween() {
    const [admin, setAdminAccount] = useState({
        email: "",
        role: ""
    });
    const [accounts, setAccounts] = useState({
        memberID1: 0,
        memberID2: 0
    });
    const [fromAccount, setFromAccount] = useState('Savings');
    const [toAccount, setToAccount] = useState('Checking');
    const [amount, setAmount] = useState('');

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const sessionResponse = await fetch(`http://localhost:4000/session_get`, {
                    method: 'GET',
                    credentials: 'include'
                });
                const username = await sessionResponse.json();
                if (username === "No session set") {
                    window.alert("You are not logged in, returning to login page...");
                    window.location.href = 'http://localhost:3000/';
                }
                const response = await fetch(`http://localhost:4000/accounts/${username}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch account data');
                }
                const data = await response.json();
                if (data.length > 0) {
                    const accountData = data[0];
                    setAdminAccount({
                        email: accountData.emailAddress,
                        role: accountData.role
                    });
                }
                if (admin.role === "Customer") {
                    window.alert("You don't have the clearance for this action, returning to login page...");
                    window.location.href = 'http://localhost:3000/account';
                }
            } catch (error) {
                console.error('Error fetching account data:', error);
            }
        };
        fetchAccounts();
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setAccounts(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleTransfer = async () => {
        try {
            let transferDetails = {
                memberID1: accounts.memberID1,
                fromAccount: fromAccount,
                memberID2: accounts.memberID2,
                toAccount: toAccount,
                transfer: amount
            }
            const response = await fetch(`http://localhost:4000/transfer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transferDetails),
            });

            if (response.ok) {
                let historyDetails = {
                    accountType: "TransferOutside",
                    fromUser: accounts.memberID1,
                    toUser: accounts.memberID2,
                    toAccount: toAccount,
                    fromAccount: fromAccount,
                    transfer: amount
                }
                await fetch(`http://localhost:4000/history/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(historyDetails),
                }); 
            }

        } catch (error) {
            console.error('Error:', error);
        }
    };

    return(
        <div className="container mt-5">
            <h1 className="text-center">Tranfer Between Accounts</h1>
            <form onSubmit={handleTransfer}>
                <h2 className="text-center">Admin: {admin.email}</h2>    
                <div className="form-group">
                    <label htmlFor="memberID1">From Member ID</label>
                    <input
                        type="number"
                        id="memberID1"
                        className="form-control"
                        value={accounts.memberID1}
                        onChange={handleChange}
                        placeholder="Enter Member ID"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="memberID2">To 2 Member ID</label>
                    <input
                        type="number"
                        id="memberID2"
                        className="form-control"
                        value={accounts.memberID2}
                        onChange={handleChange}
                        placeholder="Enter Member ID"
                        required
                    />
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <div className="form-group">
                            <label htmlFor="fromAccount" className="form-label">From Account</label>
                            <select id="fromAccount" className="form-select" value={fromAccount} onChange={(e) => setFromAccount(e.target.value)}>
                                <option value="Savings">Savings</option>
                                <option value="Checking">Checking</option>
                                <option value="Investment">Investment</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="form-group">
                            <label htmlFor="toAccount" className="form-label">To Account</label>
                            <select id="toAccount" className="form-select" value={toAccount} onChange={(e) => setToAccount(e.target.value)}>
                                <option value="Savings">Savings</option>
                                <option value="Checking">Checking</option>
                                <option value="Investment">Investment</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="form-group">
                        <label htmlFor="amount" className="form-label">Amount</label>
                        <input id="amount" type="number" className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} required/>
                    </div>
                </div>
                <div className="row mt-5">
                    <div className="col text-center">
                        <button type="submit" className="btn btn-primary btn-block">Transfer</button>
                    </div>
                </div>
                <br></br>
                <div className="col text-center">
                    <Link to="/account" className="btn btn-primary">Return to Main Menu</Link>
                </div>
            </form>
        </div>
    );
}

export default TransferBetween;