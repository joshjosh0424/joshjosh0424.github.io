import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Account = () => {
    const [accounts, setAccounts] = useState({
        username: "",
        savings: 0,
        checking: 0,
        investment: 0
    });
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
                    setAccounts({
                        username: accountData.emailAddress,
                        savings: accountData.savings * 0.01,
                        checking: accountData.checking  * 0.01,
                        investment: accountData.investment  * 0.01,
                    });
                }
            } catch (error) {
                console.error('Error fetching account data:', error);
            }
        };
    
        fetchAccounts();
    }, []);

    return(
        <div className="container mt-5">
            <h1 className="text-center">Banking App</h1>
            <h2 className="text-center">Hello, {accounts.username}!</h2>
            <div className="row mt-4">
                <div className="col text-center">
                    <h3>Savings</h3>
                    <div className="border rounded p-5">
                        <h2>${accounts.savings}</h2>
                    </div>
                </div>
                <div className="col text-center">
                    <h3>Checking</h3>
                    <div className="border rounded p-5">
                        <h2>${accounts.checking}</h2>
                    </div>
                </div>
                <div className="col text-center">
                    <h3>Investment</h3>
                    <div className="border rounded p-5">
                        <h2>${accounts.investment}</h2>
                    </div>
                </div>
            </div>
            <div className="row mt-5">
                <div className="col text-center">
                    <Link to="/deposit" className="btn btn-primary">Deposit</Link>
                </div>
                <div className="col text-center">
                    <Link to="/transfer" className="btn btn-primary">Transfer</Link>
                </div>
                <div className="col text-center">
                    <Link to="/withdraw" className="btn btn-primary">Withdraw</Link>
                </div>
            </div>
            <br></br>
            <div className="col text-center">
                <Link to="/history" className="btn btn-primary">Transaction History</Link>
            </div>
            <br></br>
            <div className="col text-center">
                <Link to="/logout" className="btn btn-primary">Logout</Link>
            </div>
        </div>
    );
};

export default Account;