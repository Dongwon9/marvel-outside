import React, { useCallback, useState } from "react";

import { ConfirmContext } from "./ConfirmContext";

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [request, setRequest] = useState<ConfirmRequest | null>(null);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setRequest({
        ...options,
        resolve,
      });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (request) {
      request.resolve(true);
      setRequest(null);
    }
  }, [request]);

  const handleCancel = useCallback(() => {
    if (request) {
      request.resolve(false);
      setRequest(null);
    }
  }, [request]);

  return (
    <ConfirmContext.Provider
      value={{ request, confirm, handleConfirm, handleCancel }}
    >
      {children}
    </ConfirmContext.Provider>
  );
}
export type ConfirmOptions = {
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDangerous?: boolean;
};
export type ConfirmRequest = ConfirmOptions & {
  resolve: (value: boolean) => void;
};
