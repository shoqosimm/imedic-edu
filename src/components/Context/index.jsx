import React, { createContext } from "react";
import { useState } from "react";

export const ContextItem = createContext();

const ContextWrapper = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("access_token"));

  return (
    <ContextItem.Provider value={[token, setToken]}>
      {children}
    </ContextItem.Provider>
  );
};

export default ContextWrapper;
