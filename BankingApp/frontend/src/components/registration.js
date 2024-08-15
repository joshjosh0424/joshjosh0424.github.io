import React, { useState, useEffect } from "react";

function Register() {
    const [userCredentials, setCredentials] = useState({
        firstName: "",
        lastName: "",
        emailAddress: "",
        phoneNumber: "",
        password: ""
    });
    const [accountAdmin, setAccountAdmin] = useState({
        email: "",
        role: ""
    });
    const [error, setError] = useState('');

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
                    setAccountAdmin({
                        email: accountData.emailAddress,
                        role: accountData.role
                    });
                }
                
                if (accountAdmin.role === "Customer") {
                    window.alert("You don't have the clearance for this action, returning to login page...");
                    window.location.href = 'http://localhost:3000/account';
                }
            } catch (error) {
                console.error('Error fetching account data:', error);
            }
        };
    
        fetchAccounts();
    },[]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setCredentials(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleRegister = async () => {
        try {
            const response = await fetch(`http://localhost:4000/accounts/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userCredentials),
                credentials: "include"
            });
            if (response.ok) {
                window.location.href = '/login';
            } else {
                setError('An account is already using this Email');
            }
        } catch (err) {
            setError('Server error. Please try again later.' + JSON.stringify(userCredentials));
        }
    };
    
    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow-sm" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 className="card-title text-center">Register New Account</h2>
                <h3 className="text-center">Admin: {accountAdmin.email}</h3>
                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            className="form-control"
                            value={userCredentials.firstName}
                            onChange={handleChange}
                            placeholder="Enter your First Name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            className="form-control"
                            value={userCredentials.lastName}
                            onChange={handleChange}
                            placeholder="Enter your Last Name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="emailAddress">Email Address</label>
                        <input
                            type="text"
                            id="emailAddress"
                            className="form-control"
                            value={userCredentials.emailAddress}
                            onChange={handleChange}
                            placeholder="Enter your Email Address"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <input
                            type="text"
                            id="phoneNumber"
                            className="form-control"
                            value={userCredentials.phoneNumber}
                            onChange={handleChange}
                            placeholder="Enter your Phone Number"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            value={userCredentials.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            value={userCredentials.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <br></br>
                    <button type="submit" className="btn btn-primary btn-block">Register</button>
                </form>{error && <div className="alert alert-danger mt-3">{error}</div>}
            </div>
        </div>
    );
};

export default Register;
