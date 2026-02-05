import "@testing-library/jest-dom";
import { afterEach, vi } from "vitest";

// 각 테스트 후 모든 mock 초기화
afterEach(() => {
  vi.clearAllMocks();
});
