import { createContext, type ReactNode } from "react";

export interface AuthContextType {
  user: { id: string; email: string; name: string } | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthContextProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
