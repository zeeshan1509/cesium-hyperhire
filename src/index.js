import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "../node_modules/cesium/Build/Cesium/Widgets/widgets.css";
import { BrowserRouter } from "react-router-dom";
import { Ion } from "cesium";

Ion.defaultAccessToken = process.env.REACT_APP_CESIUM_ION_KEY;
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

reportWebVitals();
