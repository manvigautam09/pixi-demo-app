import React from "react";
import ReactDOM from "react-dom/client";
import { Application } from "pixi.js";
import { AppProvider } from "@pixi/react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "./index.css";
import Home from "./routes/Home";
import App from "./routes/Demos";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
const app = new Application();
const router = createBrowserRouter([
  {
    path: "/demos",
    element: <App />,
  },
  {
    path: "/",
    element: <Home />,
  },
]);

root.render(
  <React.StrictMode>
    <AppProvider app={app}>
      <RouterProvider router={router} />
    </AppProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
