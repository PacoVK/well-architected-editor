import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@cloudscape-design/global-styles/index.css";
import App from "./App";
import { LensProvider } from "./state/LensProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LensProvider>
      <App />
    </LensProvider>
  </StrictMode>,
);
