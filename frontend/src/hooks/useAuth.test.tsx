import { renderHook, act } from "@testing-library/react";
import { ReactNode } from "react";

import { AuthContext } from "@/context/AuthContextDef";
import type { AuthContextType } from "@/context/AuthContextDef";

import { useAuth } from "./useAuth";

describe("useAuth", () => {
  it("should return auth context when used within AuthProvider", () => {
    const mockAuthValue: AuthContextType = {
      user: {
        id: "user-123",
        email: "test@example.com",
        name: "Test User",
      },
      isLoading: false,
      logout: jest.fn(),
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthContext.Provider value={mockAuthValue}>
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current).toEqual(mockAuthValue);
    expect(result.current.user?.name).toBe("Test User");
  });

  it("should handle null user state", () => {
    const mockAuthValue: AuthContextType = {
      user: null,
      isLoading: false,
      logout: jest.fn(),
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthContext.Provider value={mockAuthValue}>
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it.skip("should throw error when used outside of AuthProvider", () => {
    const { result } = renderHook(() => useAuth());

    expect(result.error).toBeTruthy();
    expect(result.error?.message).toBe(
      "useAuth must be used within an AuthProvider",
    );
  });

  it("should handle loading state", () => {
    const mockAuthValue: AuthContextType = {
      user: null,
      isLoading: true,
      logout: jest.fn(),
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthContext.Provider value={mockAuthValue}>
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.user).toBeNull();
  });

  it("should provide logout function", () => {
    const mockLogout = jest.fn();
    const mockAuthValue: AuthContextType = {
      user: {
        id: "user-123",
        email: "test@example.com",
        name: "Test User",
      },
      isLoading: false,
      logout: mockLogout,
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthContext.Provider value={mockAuthValue}>
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.logout();
    });

    expect(mockLogout).toHaveBeenCalled();
  });
});
