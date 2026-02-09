import { useContext } from "react";

import { ConfirmContext } from "@/context/ConfirmContext";
import { type ConfirmOptions } from "@/context/ConfirmProvider";

export function useConfirm() {
  const context = useContext(ConfirmContext);

  if (!context) {
    throw new Error("useConfirm must be used within ConfirmProvider");
  }

  return {
    confirm: (options?: ConfirmOptions) =>
      context.confirm({
        title: "확인",
        confirmLabel: "확인",
        cancelLabel: "취소",
        ...options,
      }),
  };
}

export default useConfirm;
