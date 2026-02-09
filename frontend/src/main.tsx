import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import ConfirmDialog from "./components/ConfirmDialog";
import { Toast } from "./components/ui";
import { AuthProvider } from "./context/AuthContext";
import { ConfirmProvider } from "./context/ConfirmProvider";
import { ToastProvider } from "./context/ToastContext";
import { router } from "./router/AppRouter";
import "./index.css";
import "./App.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");
createRoot(rootElement).render(
  <StrictMode>
    <ToastProvider>
      <AuthProvider>
        <ConfirmProvider>
          <RouterProvider router={router} />
          <Toast />
          <ConfirmDialog />
        </ConfirmProvider>
      </AuthProvider>
    </ToastProvider>
  </StrictMode>,
);
