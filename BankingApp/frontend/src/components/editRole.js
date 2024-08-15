import React, { useState, useEffect } from "react";

function EditRole() {
    const [roles, setRole] = useState({
        role: ""
    });
    const [account, setAccount] = useState({
        email: ""
    });
    const [accountAdmin, setAccountAdmin] = useState({
        email: "",
        role: ""
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
                    setAccountAdmin({
                        email: accountData.emailAddress,
                        role: accountData.role
                    });
                }
                if (accountAdmin.role === "Customer" || accountAdmin.role === "Employee") {
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
        setAccount(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleRoleEdit = async () => {
        try {
            let editedAccount = {
                email: account.email,
                role: roles.role
            }
            
            const response = await fetch(`http://localhost:4000/update/role`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedAccount),
            });
            
            if (response.ok) {
                window.location.href = 'http://localhost:3000/account';
            } else {
                console.error('Role change failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return(
        <div>
            <h1>Role Editor</h1>
            <h3>Admin: {accountAdmin.email}</h3>
            <form onSubmit={handleRoleEdit}>
                <div className="form-group">
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Account:</label>
                        <input 
                            type="text" 
                            id="email" 
                            className="form-control"
                            value={account.email}
                            onChange={handleChange}
                            placeholder="Enter Account to be Edited" 
                            required
                        />
                    </div>
                    <br></br>
                    <div className="form-check form-check-inline">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="positionOptions"
                            id="positionAdministrator"
                            value="Administrator"
                            checked={roles.role === "Administrator"}
                            onChange={(e) => setRole({ role: e.target.value })}
                        />
                        <label htmlFor="positionAdministrator" className="form-check-label">Administrator</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="positionOptions"
                            id="positionEmployee"
                            value="Employee"
                            checked={roles.role === "Employee"}
                            onChange={(e) => setRole({ role: e.target.value })}
                        />
                        <label htmlFor="positionEmployee" className="form-check-label">Employee</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="positionOptions"
                            id="positionCustomer"
                            value="Customer"
                            checked={roles.role === "Customer"}
                            onChange={(e) => setRole({ role: e.target.value })}
                        />
                        <label htmlFor="positionCustomer" className="form-check-label">Customer</label>
                    </div>
                </div>
                <br></br>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
}

export default EditRole;