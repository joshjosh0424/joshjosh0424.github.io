import React, { useState, useEffect } from 'react';
import { Link, useNavigate} from 'react-router-dom';

function Deposit() {
    const [accounts, setAccounts] = useState({
        email: "",
        savings: 0,
        checking: 0,
        investment: 0,
    });
    const [toAccount, setToAccount] = useState('Savings');
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
                        investment: accountData.investment * 0.01,
                    });
                }
            } catch (error) {
                console.error('Error fetching account data:', error);
            }
        };
        fetchAccounts();
    }, []);

    
    const handleDeposit = async (event) => {
        event.preventDefault();
        try {
            
            let depositDetails = {
                accountType: toAccount,
                deposit: amount
            }
            const response = await fetch(`http://localhost:4000/deposit/${accounts.email}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(depositDetails),
            });
            
            if (response.ok) {
                let historyDetails = {
                    accountType: "Deposit",
                    emailAddress: accounts.email,
                    toAccount: toAccount,
                    transfer: amount
                }
                await fetch(`http://localhost:4000/history/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(historyDetails),
                }); 

                navigate('/account');            }
             
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        // Putting an empty field in amount, or 0 causes it to remove all money from the account. IDK
        <div className="container mt-5">
            <h1 className="text-center mb-4">Deposit Funds</h1>
            <form onSubmit={handleDeposit}>
                <h2 className="text-center">Account: {accounts.email}</h2>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <div className="form-group">
                            <label htmlFor="toAccount" className="form-label">To Account</label>
                            <select id="toAccount" className="form-select" value={toAccount} onChange={(e) => setToAccount(e.target.value)}>
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
                    <button type="submit" className="btn btn-primary">Deposit</button>
                </div>
            </form>
        </div>
    );
}

export default Deposit;