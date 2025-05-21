import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Main entry point: mounts the App component into the root DOM node
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
