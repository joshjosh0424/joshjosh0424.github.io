import React, { useEffect, useState } from "react";

// this is the login page

export default function Session_Set() {
    const [status, setStatus] = useState("");

    useEffect(() => {
        async function run() {
            const response = await fetch(`http://localhost:5000/session_set`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            const statusResponse = await response.json();
            setStatus(statusResponse.status);
        }
        run();
        return;
    },[]);

    return (
        <div>
            <h3>Set Session</h3>
            <form onSubmit={onSubmit}>
                <div>
                    <label>First: </label>
                    <input
                        type="text"
                        id="first_name"
                        value={form.first_name}
                        onChange={(e) => updateForm({ first_name: e.target.value })}
                    />
                </div>
                <div>
                    <label>First: </label>
                    <input
                        type="text"
                        id="first_name"
                        value={form.first_name}
                        onChange={(e) => updateForm({ first_name: e.target.value })}
                    />
                </div>
                <div> 
                    <p>{status}</p>
                </div>
                <br/>
                <div>
                    <input
                        type="submit"
                        value="Register"
                    />
                </div>
            </form>
        </div>
    )
}