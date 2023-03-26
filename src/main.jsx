import React from "react";
import ReactDOM from "react-dom/client";
import "./style/global.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Root from "./root/Nurse/root";
import Login from "./components/Login";
import Main from "./Pages/Main";
import Register from "./components/Register";

const token = localStorage.getItem("access_token");

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={token ? <Root /> : <Navigate to="/login" />}>
        <Route path="/main" element={<Main />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  </BrowserRouter>
);
