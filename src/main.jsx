import React from "react";
import ReactDOM from "react-dom/client";
import "./style/global.css";
import { BrowserRouter, Route } from "react-router-dom";
import { route } from "./utils/routes";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
     {
      route?.map(item=>{
        return(
          <Route path={item.path} element={item.element}/>
        )
      })
     }
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
