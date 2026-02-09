import { createContext } from "react";

import type { ConfirmRequest, ConfirmOptions } from "./ConfirmProvider";

export const ConfirmContext = createContext<ConfirmContextType | undefined>(
  undefined,
);
export type ConfirmContextType = {
  request: ConfirmRequest | null;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  handleConfirm: () => void;
  handleCancel: () => void;
};
