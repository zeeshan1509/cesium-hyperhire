import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "../node_modules/cesium/Build/Cesium/Widgets/widgets.css";
import { BrowserRouter } from "react-router-dom";
import { Ion } from "cesium";
import { cesiumIonToken } from "./config";

Ion.defaultAccessToken = cesiumIonToken;
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

reportWebVitals();
