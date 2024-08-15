import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const History = (props) => (
    <tr>
        <td>{props.history.emailAddress}</td>
        <td>{Object.keys(props.history).map(function(s) {return props.history[s].type})}</td>
        <td>{Object.keys(props.history).map(function(s) {return props.history[s].user2})}</td>
        <td>{Object.keys(props.history).map(function(s) {return props.history[s].accountTo})}</td>
        <td>{Object.keys(props.history).map(function(s) {return props.history[s].accountFrom})}</td>
        <td>{Object.keys(props.history).map(function(s) {return props.history[s].amount})}</td>
        <td>{props.history.date}</td>


    </tr>
);

function HistoryList() {
    const [historys, setHistory] = useState([]);
    const [accounts, setAccounts] = useState({
        username: ""
    });
    useEffect(() => {
        async function getHistory() {
            const sessionResponse = await fetch(`http://localhost:4000/session_get`, {
                method: 'GET',
                credentials: 'include'
            });
            const username = await sessionResponse.json();
            if (username === "No session set") {
                window.alert("You are not logged in, returning to login page...");
                window.location.href = 'http://localhost:3000/';
            }
            const fetchAccount = await fetch(`http://localhost:4000/accounts/${username}`);
            if (!fetchAccount.ok) {
                throw new Error('Failed to fetch account data');
            }
            
            const data = await fetchAccount.json();
            if (data.length > 0) {
                const accountData = data[0];
                setAccounts({
                    username: accountData.emailAddress,
                    role: accountData.role
                });
            }
            
            if (accounts.role === "Customer" || accounts.role === "Employee") {
                const response = await fetch(`http://localhost:4000/history/${username}`);
                if (!response.ok) {
                    const message = `An error occurred: ${response.statusText}`;
                    window.alert(message);
                    return;
                }
                const historys = await response.json();
                setHistory(historys);
            } else {
                const response = await fetch(`http://localhost:4000/history`);
                if (!response.ok) {
                    const message = `An error occurred: ${response.statusText}`;
                    window.alert(message);
                    return;
                }
                const historys = await response.json();
                setHistory(historys);
            }
        }
        getHistory();
        return;
    }, [historys.length]);

    function historyList() {
        return historys.map((history) => {
            return (
                <History
                    history={history}
                    key={history.id}
                />
            );
        });
    }

    return (
        <div>
            <h3>Transaction History</h3>
            <table className="table table-striped" style={{ marginTop: 20 }}>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Action Type</th>
                        <th>To User</th>
                        <th>To Account</th>
                        <th>From Account</th>
                        <th>Amount (In Pennies)</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>{historyList()}</tbody>
            </table>
            <div className="col text-center">
                <Link to="/account" className="btn btn-primary">Return to Main Menu</Link>
            </div>
        </div>
    );
}

export default HistoryList;