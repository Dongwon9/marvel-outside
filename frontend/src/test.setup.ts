import { TextEncoder, TextDecoder } from "util";
import "@testing-library/jest-dom";

// TextEncoder/TextDecoder polyfill for jsdom
Object.assign(global, {
  TextEncoder,
  TextDecoder,
});

// 각 테스트 후 모든 mock 초기화
afterEach(() => {
  jest.clearAllMocks();
});
