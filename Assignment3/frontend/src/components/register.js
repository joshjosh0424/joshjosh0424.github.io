import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function Register() {
const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone_num: "",
    email: "",
    password: "",
});

const navigate = useNavigate();

function updateForm(jsonObj) {
    return setForm((prevJsonObj) => {
        return { ...prevJsonObj, ...jsonObj};
    });
}

async function onSubmit(e) {
    e.preventDefault();
    const newAccount = {...form};
    await fetch("http://localhost:5000/record/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newAccount),
    })
    .catch(error => {
        window.alert(error);
        return;
    })
    setForm({ first_name: "", last_name: "", phone_num: "", email: "", password: ""});
    navigate("/");
}

    return (
        <div>
            <h3>Registration</h3>
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
                    <label>Last: </label>
                    <input
                        type="text"
                        id="last_name"
                        value={form.last_name}
                        onChange={(e) => updateForm({ last_name: e.target.value })}
                    />
                </div>
                <div>
                    <label>Phone: </label>
                    <input
                        type="text"
                        id="phone_num"
                        value={form.phone_num}
                        onChange={(e) => updateForm({ phone_num: e.target.value })}
                    />
                </div>
                <div>
                    <label>Email: </label>
                    <input
                        type="text"
                        id="email"
                        value={form.email}
                        onChange={(e) => updateForm({ email: e.target.value })}
                    />
                </div>
                <div>
                    <label>Password: </label>
                    <input
                        type="text"
                        id="password"
                        value={form.password}
                        onChange={(e) => updateForm({ password: e.target.value })}
                    />
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
    );
}