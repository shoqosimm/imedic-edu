import React from "react";
import ReactDOM from "react-dom/client";
import "./style/global.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Root from "./root/root";
import Login from "./components/Login";
import Main from "./Pages/Main";

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />}>
          <Route path='/main' element={<Main />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
);
