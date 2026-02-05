import { render, type RenderOptions } from "@testing-library/react";
import type { ReactNode } from "react";

import type { MeResponse } from "@/api/auth";
import { AuthContext } from "@/context/AuthContext";

/**
 * Mock AuthProvider로 컴포넌트를 렌더링하기 위한 헬퍼 함수
 *
 * 사용 예시:
 * ```tsx
 * const { getByText } = renderWithAuth(<ProtectedComponent />, {
 *   user: { id: 1, email: 'test@example.com' },
 *   isLoggedIn: true
 * });
 * ```
 */

interface MockAuthContextValue {
  user: MeResponse | null;
  isLoggedIn: boolean;
  isLoading?: boolean;
  logout?: () => Promise<void>;
  refetchUser?: () => Promise<void>;
}

const defaultAuthContext: MockAuthContextValue = {
  user: null,
  isLoggedIn: false,
  isLoading: false,
  logout: async () => {},
  refetchUser: async () => {},
};

interface RenderWithAuthOptions extends Omit<RenderOptions, "wrapper"> {
  authContext?: Partial<MockAuthContextValue>;
}

/**
 * 인증 상태를 주입하여 컴포넌트를 렌더링합니다.
 */
export function renderWithAuth(
  ui: ReactNode,
  { authContext = {}, ...renderOptions }: RenderWithAuthOptions = {},
) {
  const mockAuthValue = {
    ...defaultAuthContext,
    ...authContext,
  };

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      // @ts-expect-error - AuthContext value type mismatch in test
      <AuthContext.Provider value={mockAuthValue}>
        {children}
      </AuthContext.Provider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}
