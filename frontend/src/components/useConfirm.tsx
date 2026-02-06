import { useCallback, useRef, useState } from "react";

import ConfirmDialog from "./ConfirmDialog";

type Options = {
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
};

export function useConfirm() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<Options>({});
  const resolverRef = useRef<(value: boolean) => void | null>(null);

  const open = useCallback((opts?: Options) => {
    setOptions(opts || {});
    setIsOpen(true);
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setIsOpen(false);
    if (resolverRef.current) resolverRef.current(true);
    resolverRef.current = null;
  }, []);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    if (resolverRef.current) resolverRef.current(false);
    resolverRef.current = null;
  }, []);

  const Modal = (
    <ConfirmDialog
      isOpen={isOpen}
      title={options.title}
      description={options.description}
      confirmLabel={options.confirmLabel}
      cancelLabel={options.cancelLabel}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );

  return { open, Modal };
}

export default useConfirm;
