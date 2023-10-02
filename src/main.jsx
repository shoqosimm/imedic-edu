import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import "./style/global.css";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import ProtectedRoutes from "./components/ProtectedRoutes/ProtectedRoutes";
import ErrorElement from "./Pages/ErrorPage";
import PrivateRoutes from "./components/PrivateRoutes";
import Loading from "./components/Loader";
import "react-toastify/dist/ReactToastify.css";
import "sweetalert2/src/sweetalert2.scss";
import ContextWrapper from "./components/Context";
import ViewAnswers from "./components/Nurse/NurseMyCourse/MySubjectTest/viewAnswers";
import ListBranch from "./components/Admin/Branch/ListBranch";
import List from "./components/Admin/Nurses/List";
import UserList from "./components/Admin/Users/userList";
import './utils/i18';
import Months from "./components/Admin/Month/Months";
import StatisticList from "./components/Admin/Statistic/Statistic";

const Login = lazy(() => import("./components/Login"));
const Register = lazy(() => import("./components/Register"));

// nurse-imports
const Nurse = lazy(() => import("./root/NurseRoot/root"));
const NurseCoursePage = lazy(() => import("./Pages/NursePages/Course"));
const NurseMyCourse = lazy(() =>
  import("./components/Nurse/NurseMyCourse/MySubjectList")
);
const NurseMySettingPage = lazy(() => import("./Pages/NursePages/Setting"));
const NurseMyCourseList = lazy(() =>
  import("./components/Nurse/NurseMyCourse")
);
const SubjectPage = lazy(() =>
  import("./components/Nurse/NurseCourse/SubjectPage")
);
const SubjectItemPage = lazy(() =>
  import("./components/Nurse/NurseCourse/SubjectItemPage")
);
const MySubjectItemPage = lazy(() =>
  import("./components/Nurse/NurseMyCourse/MySubjectItemPage")
);
const MySubjectTest = lazy(() =>
  import("./components/Nurse/NurseMyCourse/MySubjectTest")
);

// teacher-imports
const Teacher = lazy(() => import("./root/TeacherRoot/root"));
const TeacherCoursePage = lazy(() => import("./Pages/TeacherPage/Course"));
const TeacherSettingPage = lazy(() => import("./Pages/TeacherPage/Setting"));
const TeacherReportPage = lazy(() => import("./Pages/TeacherPage/Report"));
const CreateCourse = lazy(() => import("./Pages/TeacherPage/CreateCourse"));
const CreateTestPage = lazy(() =>
  import("./Pages/TeacherPage/Subject/Test/CreateTestPage")
);
const EditTest = lazy(() =>
  import("./components/Teacher/TeacherSubject/Test/EditTest")
);
const EditCooursePage = lazy(() =>
  import("./Pages/TeacherPage/EditCouresePage")
);
const ViewCoursePage = lazy(() => import("./Pages/TeacherPage/ViewCoursePage"));
const CreateSubjectPage = lazy(() =>
  import("./Pages/TeacherPage/Subject/CreateSubjectPage")
);
const EditSubjectPage = lazy(() =>
  import("./Pages/TeacherPage/Subject/EditSubjectPage")
);
const ViewSubjectPage = lazy(() =>
  import("./Pages/TeacherPage/Subject/ViewSubjectPage")
);

// admin-imports
const AdminRoute = lazy(() => import("./root/AdminRoot/root"));
const AdminCategory = lazy(() => import("./components/Admin/Category"));
const AdminTeacherList = lazy(() => import("./components/Admin/TeachersList"));
// router
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
            <Suspense fallback={<Loading />}>
              <Nurse />
            </Suspense>
          </PrivateRoutes>
        }
      >
        <Route index element={<NurseCoursePage />} />
        <Route path="course" element={<NurseCoursePage />} />
        <Route path="course/:id" element={<SubjectPage />} />
        <Route path="course/subject/:id" element={<SubjectItemPage />} />
        <Route path="mycourse" element={<NurseMyCourseList />} />
        <Route path="mycourse/:id" element={<NurseMyCourse />} />
        <Route
          path="mycourse/:id/subject/:id"
          element={<MySubjectItemPage />}
        />
        <Route
          path="mycourse/:id/subject/test/:id"
          element={<MySubjectTest />}
        />
        <Route path="answers" element={<ViewAnswers />} />
        <Route path="setting" element={<NurseMySettingPage />} />
      </Route>

      {/* teacher */}
      <Route
        path="/teacher/*"
        element={
          <PrivateRoutes>
            <Suspense fallback={<Loading />}>
              <Teacher />
            </Suspense>
          </PrivateRoutes>
        }
      >
        <Route index element={<TeacherCoursePage />} />
        <Route path="course" element={<TeacherCoursePage />} />
        <Route path="course/:id/edit" element={<EditCooursePage />} />
        <Route path="course/:id/view" element={<ViewCoursePage />} />
        <Route path="setting" element={<TeacherSettingPage />} />
        <Route path="report" element={<TeacherReportPage />} />
        <Route path="course/create" element={<CreateCourse />} />
        <Route path="subject/create/:id" element={<CreateSubjectPage />} />
        <Route path="subject/edit/:id" element={<EditSubjectPage />} />
        <Route path="subject/view/:id" element={<ViewSubjectPage />} />
        <Route path="subject/create/test/:id" element={<CreateTestPage />} />
        <Route path="subject/edit/test/:id" element={<EditTest />} />
        <Route path="nurses" element={<List/>} />

      </Route>

      {/* admin */}
      <Route
        path="/admin/*"
        element={
          <PrivateRoutes>
            <Suspense fallback={<Loading />}>
              <AdminRoute />
            </Suspense>
          </PrivateRoutes>
        }
      >
        <Route index element={<AdminTeacherList />} />
        <Route path="admin-teacher" element={<AdminTeacherList />} />
        <Route path="category" element={<AdminCategory />} />
        <Route path="branch" element={<ListBranch/>} />
        <Route path="nurses" element={<List/>} />
        <Route path="users" element={<UserList/>} />
        <Route path="months" element={<Months/>}/>
        <Route path="statistic" element={<StatisticList/>}/>
      </Route>

      {/* auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <ContextWrapper>
    <Suspense fallback={<Loading />}>
      <RouterProvider router={router} />
    </Suspense>
  </ContextWrapper>
);
