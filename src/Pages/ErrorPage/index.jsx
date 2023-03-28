import React from "react";
import { useLocation } from "react-router-dom";
import './style.scss';

const ErrorElement = () => {
  const location = useLocation();

  return (
    <div className="errorElement">
      <h1 className="mainError">404</h1>
      <h1>Упс! что-то пошло не так</h1>
      <h2>страница <span>{location.pathname}</span> не найдено</h2>
    </div>
  );
};

export default ErrorElement;
