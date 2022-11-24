import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import "./index.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { HelmetProvider } from "react-helmet-async";
import { StoreProvider } from "./Store";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <StoreProvider>
      <HelmetProvider>
        <PayPalScriptProvider deferLoading={true}>
          <App />
        </PayPalScriptProvider>
      </HelmetProvider>
    </StoreProvider>
  </React.StrictMode>
);
