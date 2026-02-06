import type { LucideIcon } from "lucide-react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

import type { Toast, ToastType } from "@/context/toast";
import { useToast } from "@/hooks/useToast";

function getToastStyles(type: ToastType): string {
  const baseStyles =
    "flex items-center gap-3 rounded-lg p-4 shadow-lg backdrop-blur-sm";

  const typeStyles: Record<ToastType, string> = {
    success: "bg-green-50 text-green-800 border border-green-200",
    error: "bg-red-50 text-red-800 border border-red-200",
    info: "bg-blue-50 text-blue-800 border border-blue-200",
    warning: "bg-yellow-50 text-yellow-800 border border-yellow-200",
  };

  return `${baseStyles} ${typeStyles[type]}`;
}

function getIconComponent(type: ToastType): LucideIcon {
  const iconMap: Record<ToastType, LucideIcon> = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  };

  return iconMap[type];
}

export default function ToastComponent() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed top-4 right-4 z-50 flex flex-col gap-2 sm:top-6 sm:right-6">
      {toasts.map((toast: Toast) => {
        const Icon = getIconComponent(toast.type);
        return (
          <div
            key={toast.id}
            className={`animate-in fade-in slide-in-from-right-2 pointer-events-auto duration-200 ${getToastStyles(toast.type)}`}
          >
            <Icon className="h-5 w-5 shrink-0" />
            <p className="flex-1 text-sm font-medium md:text-base">
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 shrink-0 transition-opacity hover:opacity-70"
              aria-label="토스트 닫기"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
