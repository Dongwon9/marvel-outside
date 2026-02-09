import { TextEncoder, TextDecoder } from "util";
import "@testing-library/jest-dom";

// TextEncoder/TextDecoder polyfill for jsdom
if (typeof globalThis.TextEncoder === "undefined") {
  globalThis.TextEncoder = TextEncoder;
}
if (typeof globalThis.TextDecoder === "undefined") {
  globalThis.TextDecoder = TextDecoder;
}

// 각 테스트 후 모든 mock 초기화
afterEach(() => {
  jest.clearAllMocks();
});
