import React from "react";  // ✅ Ensure React is imported
import ReactDOM from "react-dom/client";  // ✅ Use correct casing for 'ReactDOM'
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import StoreContextProvider from "./context/StoreContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode> {/* Optional: Helps with debugging */}
    <BrowserRouter>
      <StoreContextProvider>
        <App />
      </StoreContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
