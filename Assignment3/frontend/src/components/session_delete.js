import React, { useEffect, useState } from "react";

// this is the logout page

export default function Session_Set() {
    const [status, setStatus] = useState("");

    useEffect(() => {
        async function run() {
            const response = await fetch(`http://localhost:5000/session_delete`,
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
            <h3>Delete Session</h3>
            <p>{status}</p>
        </div>
    )
}