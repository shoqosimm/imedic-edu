import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { ContextItem } from "../Context";

const PrivateRoutes = ({ children }) => {
  const [token] = useContext(ContextItem);

  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default PrivateRoutes;
