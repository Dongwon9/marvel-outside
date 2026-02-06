import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { Toast } from "./components/ui";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { router } from "./router/AppRouter";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");
createRoot(rootElement).render(
  <StrictMode>
    <ToastProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toast />
      </AuthProvider>
    </ToastProvider>
  </StrictMode>,
);
