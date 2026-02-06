
type ConfirmDialogProps = {
  isOpen: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  isOpen,
  title = "확인",
  description,
  confirmLabel = "확인",
  cancelLabel = "취소",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />

      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        {description && (
          <p className="mb-4 text-sm text-gray-600">{description}</p>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="rounded-md border px-3 py-1 text-sm hover:bg-gray-100"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            className="rounded-md bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
