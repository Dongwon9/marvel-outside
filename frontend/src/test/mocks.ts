import { vi } from "vitest";

/**
 * Axios client mock 설정
 * 각 테스트에서 필요한 API 응답을 주입할 수 있습니다.
 *
 * 사용 예시:
 * ```tsx
 * vi.mocked(client.get).mockResolvedValue({
 *   status: 200,
 *   data: { id: 1, title: 'Test Post' }
 * });
 * ```
 */
export const mockClient = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
};

/**
 * API 모킹 헬퍼
 * 테스트에서 간단하게 API 응답을 설정할 수 있습니다.
 */
export const createMockResponse = <T>(data: T, status = 200) => ({
  status,
  statusText: "OK",
  headers: {},
  config: { url: "" },
  data,
});

/**
 * API 에러 모킹 헬퍼
 * API 실패 시나리오를 테스트할 때 사용합니다.
 */
export const createMockError = (status: number, message: string) => ({
  response: {
    status,
    data: { message },
    statusText: ["", "", "", "", "", ""][status] || "Error",
  },
  message,
  config: { url: "" },
});
