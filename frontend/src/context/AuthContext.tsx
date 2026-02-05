import { useState, useEffect, useCallback, type ReactNode } from "react";

import { getMe, logout as logoutApi, type MeResponse } from "../api/auth";

import { AuthContext, type AuthContextType } from "./AuthContextDef";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const userData = await getMe();
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
      setUser(null);
    } catch (error) {
      console.error("Failed to logout:", error);
      setUser(null);
    }
  }, []);

  const refetchUser = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  // 앱 로드 시 /auth/me 호출
  useEffect(() => {
    void fetchUser();
  }, [fetchUser]);

  const value: AuthContextType = {
    user,
    isLoading,
    isLoggedIn: !!user,
    logout,
    refetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
