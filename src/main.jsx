import React from "react";
import ReactDOM from "react-dom/client";
import "./style/global.css";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Nurse from "./root/NurseRoot/root";
import NurseCoursePage from "./Pages/NursePages/Course";
import NurseMyCoursePage from "./Pages/NursePages/MyCourse";
import NurseMySettingPage from "./Pages/NursePages/Setting";
import Teacher from "./root/TeacherRoot/root";
import TeacherCoursePage from "./Pages/TeacherPage/Course";
import TeacherSettingPage from "./Pages/TeacherPage/Setting";
import TeacherReportPage from "./Pages/TeacherPage/Report";
import ProtectedRoutes from "./components/ProtectedRoutes/ProtectedRoutes";
import ErrorElement from "./Pages/ErrorPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path="/"
        element={<ProtectedRoutes />}
        errorElement={<ErrorElement />}
      />
      <Route path="/nurse/*" element={<Nurse />}>
        <Route index element={<NurseCoursePage />} />
        <Route path="course" element={<NurseCoursePage />} />
        <Route path="mycourse" element={<NurseMyCoursePage />} />
        <Route path="setting" element={<NurseMySettingPage />} />
      </Route>
      <Route path="/teacher/*" element={<Teacher />}>
        <Route index element={<TeacherCoursePage />} />
        <Route path="course" element={<TeacherCoursePage />} />
        <Route path="setting" element={<TeacherSettingPage />} />
        <Route path="report" element={<TeacherReportPage />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
