import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";

import { ToastContext, type ToastContextType } from "@/context/toast";

import { useToast } from "./useToast";

describe("useToast", () => {
  it("should return toast context when used within ToastProvider", () => {
    const mockToastContext: ToastContextType = {
      toasts: [],
      addToast: jest.fn(() => "toast-id"),
      removeToast: jest.fn(),
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <ToastContext.Provider value={mockToastContext}>
        {children}
      </ToastContext.Provider>
    );

    const { result } = renderHook(() => useToast(), { wrapper });

    expect(result.current).toEqual(mockToastContext);
  });

  it("should throw error when used outside of ToastProvider", () => {
    expect(() => renderHook(() => useToast())).toThrow(
      "useToast는 ToastProvider 내에서만 사용할 수 있습니다",
    );
  });

  it("should allow adding success toast", () => {
    const addToastMock = jest.fn(() => "toast-123");
    const mockToastContext: ToastContextType = {
      toasts: [],
      addToast: addToastMock,
      removeToast: jest.fn(),
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <ToastContext.Provider value={mockToastContext}>
        {children}
      </ToastContext.Provider>
    );

    const { result } = renderHook(() => useToast(), { wrapper });

    const toastId = act(() => {
      return result.current.addToast("Success message", "success");
    });

    expect(addToastMock).toHaveBeenCalledWith("Success message", "success");
  });

  it("should allow adding error toast with duration", () => {
    const addToastMock = jest.fn(() => "toast-456");
    const mockToastContext: ToastContextType = {
      toasts: [],
      addToast: addToastMock,
      removeToast: jest.fn(),
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <ToastContext.Provider value={mockToastContext}>
        {children}
      </ToastContext.Provider>
    );

    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.addToast("Error occurred", "error", 3000);
    });

    expect(addToastMock).toHaveBeenCalledWith("Error occurred", "error", 3000);
  });

  it("should allow removing toast", () => {
    const removeToastMock = jest.fn();
    const mockToastContext: ToastContextType = {
      toasts: [
        {
          id: "toast-123",
          message: "Test toast",
          type: "info",
        },
      ],
      addToast: jest.fn(() => "toast-id"),
      removeToast: removeToastMock,
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <ToastContext.Provider value={mockToastContext}>
        {children}
      </ToastContext.Provider>
    );

    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.removeToast("toast-123");
    });

    expect(removeToastMock).toHaveBeenCalledWith("toast-123");
  });

  it("should return current toast list", () => {
    const mockToasts = [
      { id: "toast-1", message: "Message 1", type: "success" as const },
      { id: "toast-2", message: "Message 2", type: "error" as const },
    ];

    const mockToastContext: ToastContextType = {
      toasts: mockToasts,
      addToast: jest.fn(() => "toast-id"),
      removeToast: jest.fn(),
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <ToastContext.Provider value={mockToastContext}>
        {children}
      </ToastContext.Provider>
    );

    const { result } = renderHook(() => useToast(), { wrapper });

    expect(result.current.toasts).toHaveLength(2);
    expect(result.current.toasts[0].type).toBe("success");
    expect(result.current.toasts[1].type).toBe("error");
  });
});
