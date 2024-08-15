import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Withdraw() {
    const [accounts, setAccounts] = useState({
        email: "",
        savings: 0,
        checking: 0,
        investment: 0
    });
    const [fromAccount, setFromAccount] = useState('Savings');
    const [amount, setAmount] = useState('');
    const navigate = useNavigate();

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
                        email: accountData.emailAddress,
                        savings: accountData.savings * 0.01,
                        checking: accountData.checking * 0.01,
                        investment: accountData.investment * 0.01
                    });
                }
            } catch (error) {
                console.error('Error fetching account data:', error);
            }
        };
        fetchAccounts();
    }, []);

    const handleWithdraw = async (event) => {
        event.preventDefault();
        try {
            let withdrawDetails = {
                accountType: fromAccount,
                withdraw: amount
            }
            const response = await fetch(`http://localhost:4000/withdraw/${accounts.email}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(withdrawDetails),
            });
    
            if (response.ok) {
                let historyDetails = {
                    accountType: "Withdraw",
                    emailAddress: accounts.email,
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

                navigate("/account");
            }
            
        } catch (error) {
            console.error('Error:', error);
        }
    };


    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Withdraw Funds</h1>
            <form onSubmit={handleWithdraw}>
                <h2 className="text-center">Account: {accounts.email}</h2>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <div className="form-group">
                            <label htmlFor="fromAccount" className="form-label">From Account</label>
                            <select id="fromAccount" className="form-select" value={fromAccount} onChange={(e) => setFromAccount(e.target.value)}>
                                <option value="Savings">Savings - ${accounts.savings.toFixed(2)}</option>
                                <option value="Checking">Checking - ${accounts.checking.toFixed(2)}</option>
                                <option value="Investment">Investment - ${accounts.investment.toFixed(2)}</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 mb-3">
                    <div className="form-group">
                    <label htmlFor="amount" className="form-label">Amount</label>
                    <input id="amount" type="number" className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} required/>
                </div>
            </div>
            <div className="text-center">
                <button type="submit" className="btn btn-primary">Withdraw</button>
            </div>
        </form>
    </div>
    );
}

export default Withdraw;