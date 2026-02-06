import { useContext } from "react";

import type { ToastContextType } from "@/context/toast";
import { ToastContext } from "@/context/toast";

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast는 ToastProvider 내에서만 사용할 수 있습니다");
  }
  return context;
}
