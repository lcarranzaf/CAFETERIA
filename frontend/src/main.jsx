// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { OrderProvider } from "./context/OrderContext";
import Modal from "react-modal";
Modal.setAppElement('#root');
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <OrderProvider>
        <App />
      </OrderProvider>
    </AuthProvider>
  </React.StrictMode>
);
