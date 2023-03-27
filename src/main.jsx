import React from "react";
import ReactDOM from "react-dom/client";
import "./style/global.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Root from "./root/root";
import Login from "./components/Login";
import Main from "./Pages/Main";
import Course from "./Pages/Nurse/Course";
import Subject from "./Pages/Nurse/Subject";
import SubjectItem from "./Pages/Nurse/SubjectItem";

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />}>
          <Route path='/main' element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/nurse/course" element={<Course />} />
          <Route path="/nurse/course/:id" element={<Subject />} />
          <Route path="/nurse/subject/:id" element={<SubjectItem/>} />
        </Route>
      </Routes>
    </BrowserRouter>
);
