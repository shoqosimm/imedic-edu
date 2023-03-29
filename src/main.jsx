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
import CreateCourse from "./Pages/TeacherPage/CreateCourse";
import EditCooursePage from "./Pages/TeacherPage/EditCouresePage";
import ViewCoursePage from "./Pages/TeacherPage/ViewCoursePage";
import CreateSubjectPage from "./Pages/TeacherPage/Subject/CreateSubjectPage";
import EditSubjectPage from "./Pages/TeacherPage/Subject/EditSubjectPage";
import ViewSubjectPage from "./Pages/TeacherPage/Subject/ViewSubjectPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path="/"
        element={<ProtectedRoutes />}
        errorElement={<ErrorElement />}
      />
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
        <Route path="course/:id/edit" element={<EditCooursePage/>} />
        <Route path="course/:id/view" element={<ViewCoursePage />} />
        <Route path="setting" element={<TeacherSettingPage />} />
        <Route path="report" element={<TeacherReportPage />} />
        <Route path="course/create" element={<CreateCourse />} />
        <Route path="subject/create/:id" element={<CreateSubjectPage />} />
        <Route path="subject/edit/:id" element={<EditSubjectPage />} />
        <Route path="subject/view/:id" element={<ViewSubjectPage/>}/>
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
