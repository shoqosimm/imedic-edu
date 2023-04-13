import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { ContextItem } from "../Context";

const ProtectedRoutes = () => {
  const [token] = useContext(ContextItem);
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" />;
  }
  if (role == "nurse") {
    return <Navigate to="/nurse" />;
  }
  if (role == "teacher") {
    return <Navigate to="/teacher" />;
  }
  if (role == "admin") {
    return <Navigate to="/admin" />;
  }
};

export default ProtectedRoutes;
