import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ImageProvider } from "./context/ImageContext";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ImageProvider>
        <App />
      </ImageProvider>
    </BrowserRouter>
  </React.StrictMode>
);
