import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./components/login.js";
import Register from "./components/registration.js";
import Deposit from "./components/deposit.js";
import Withdraw from "./components/withdraw.js";
import Account from "./components/account.js";
import Transfer from "./components/transfer.js";
import TransferBetween from "./components/transferBetween.js";
import EditRole from "./components/editRole.js";
import HistoryList from "./components/history.js"
import Logout from "./components/logout.js"

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/account" element={<Account />} />
        <Route path="/registration" element={<Register />} />
        <Route path="/transfer" element={<Transfer />} />
        <Route path="/deposit" element={<Deposit />} />
        <Route path="/withdraw" element={<Withdraw />} />
        <Route path="/editRole" element={<EditRole />} />
        <Route path="/transferBetween" element={<TransferBetween />} />
        <Route path="/history" element={<HistoryList />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </div>
  );
}
export default App;
