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
import SubjectPage from "./components/Nurse/NurseCourse/SubjectPage";
import SubjectItemPage from "./components/Nurse/NurseCourse/SubjectItemPage";
import PrivateRoutes from "./components/PrivateRoutes";
import AdminRoute from "./root/AdminRoot/root";
import AdminCategory from "./components/Admin/Category";
import AdminTeacherList from "./components/Admin/TeachersList";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path="/"
        element={<ProtectedRoutes />}
        errorElement={<ErrorElement />}
      />

      {/* nurse */}
      <Route
        path="/nurse/*"
        element={
          <PrivateRoutes>
            <Nurse />
          </PrivateRoutes>
        }
      >
        <Route index element={<NurseCoursePage />} />
        <Route path="course" element={<NurseCoursePage />} />
        <Route path="course/:id" element={<SubjectPage />} />
        <Route path="course/subject/:id" element={<SubjectItemPage />} />
        <Route path="mycourse" element={<NurseMyCoursePage />} />
        <Route path="setting" element={<NurseMySettingPage />} />
      </Route>

      {/* teacher */}
      <Route
        path="/teacher/*"
        element={
          <PrivateRoutes>
            <Teacher />
          </PrivateRoutes>
        }
      >
        <Route index element={<TeacherCoursePage />} />
        <Route path="course" element={<TeacherCoursePage />} />
        <Route path="setting" element={<TeacherSettingPage />} />
        <Route path="report" element={<TeacherReportPage />} />
      </Route>

      {/* admin */}
      <Route
        path="/admin/*"
        element={
          <PrivateRoutes>
            <AdminRoute />
          </PrivateRoutes>
        }
      >
        <Route index element={<AdminTeacherList />} />
        <Route path="admin-teacher" element={<AdminTeacherList />} />
        <Route path="category" element={<AdminCategory />} />
      
      </Route>

      {/* auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
