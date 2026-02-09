import React, { useContext } from "react";

import { ConfirmContext } from "@/context/ConfirmContext";

export default function ConfirmDialog() {
  const context = useContext(ConfirmContext);

  if (!context || !context.request) return null;

  const {
    title = "확인",
    description,
    confirmLabel = "확인",
    cancelLabel = "취소",
    isDangerous = false,
  } = context.request;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={context.handleCancel}
        role="button"
        tabIndex={-1}
      />

      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        {description && (
          <p className="mb-4 text-sm text-gray-600">{description}</p>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100"
            onClick={context.handleCancel}
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            className={`rounded-md px-4 py-2 text-sm font-medium text-white transition-colors ${
              isDangerous
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            onClick={context.handleConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
