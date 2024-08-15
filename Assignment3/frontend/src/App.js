import React from "react";
import { Route, Routes } from "react-router-dom";
import Records from "./components/summary.js";
import Register from "./components/register.js";
import Account from "./components/account.js";
import Session_Set from "./components/session_set.js";
import Session_Delete from "./components/session_delete.js";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Records />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account/:email" element={<Account />} />
        <Route path="/session_set" element={<Session_Set/>} />
        <Route path="/session_delete" element={<Session_Delete/>} />
      </Routes>
    </div>
  );
}
export default App;
