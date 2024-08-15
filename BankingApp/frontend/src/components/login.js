import React, { useState } from 'react';

function Login() {
    const [userCredentials, setCredentials] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState('');
    
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:4000/check`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userCredentials),
                credentials: "include"
            });

            if (response.ok) {
                const result = await response.json();
                if (result) {
                    const sessionResponse = await fetch(`http://localhost:4000/session_set/${userCredentials.email}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        credentials: "include"
                    });
                    if (sessionResponse.ok) {
                        window.location.href = 'http://localhost:3000/account';
                    }
                } else {
                    setError('Invalid username or password');
                }
            } else {
                setError('Invalid username or password// response');
            }
        } catch (err) {
            setError('Server error. Please try again later.');
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setCredentials(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow-sm" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 className="card-title text-center">Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="email">Username</label>
                        <input
                            type="text"
                            id="email"
                            className="form-control"
                            value={userCredentials.email}
                            onChange={handleChange}
                            placeholder="Enter your username"
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
                    <button type="submit" className="btn btn-primary btn-block">Login</button>
                </form>
                {error && <div className="alert alert-danger mt-3">{error}</div>}
            </div>
            
        </div>
    );
};

export default Login;
