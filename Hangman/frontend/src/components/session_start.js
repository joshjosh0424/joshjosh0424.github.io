import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

export default function UserName() {
	const [name, setName] = useState("");

	const navigate = useNavigate();

	useEffect(() => {
		async function run() {
			console.log("Game has been reset");
			const response = await fetch(`http://localhost:4000/session_end`, {
				method: "GET",
				credentials: "include",
			});
		}

		//run();
	}, []);

	async function onSubmit(e) {
		e.preventDefault();
        console.log("before fetch")
		const response = await fetch(`http://localhost:4000/session_start`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
            name: name,
        }),
		});
        console.log("made it past fetch!")
		if (response.status === 301) {
			window.alert(await response.json());
		}
		if (!response.ok) {
			const messge = `An error occured: ${response.statusText}`;
			window.alert(messge);
			return;
		}
        // navigate to the game
		navigate("/game");
	}

	return (
		<div>
			<form onSubmit={onSubmit}>
				<div>
					<label> Please enter your username: </label>
					<input
						type="text"
						id="name"
            			autoComplete="off"
						onChange={(e) => setName(e.target.value)}
					/>
				</div>
				<div>
					<input type="submit" value="Start"/>
				</div>
			</form>
		</div>
	);
}