import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" />;
  }
  if (role == 'nurse') {
    return <Navigate to="/nurse" />;
  }
  if (role == 'teacher') {
    return <Navigate to="/teacher" />;
  }
  if (role == 'admin') {
    return <Navigate to="/admin" />;
  }
};

export default ProtectedRoutes;
