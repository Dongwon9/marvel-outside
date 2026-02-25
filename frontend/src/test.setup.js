const { TextEncoder, TextDecoder } = require("util");
require("@testing-library/jest-dom");

// TextEncoder/TextDecoder polyfill for jsdom
if (typeof globalThis.TextEncoder === "undefined") {
  globalThis.TextEncoder = TextEncoder;
}
if (typeof globalThis.TextDecoder === "undefined") {
  globalThis.TextDecoder = TextDecoder;
}

// Suppress React act() warnings during async state updates in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      args[0]?.includes?.("An update to") &&
      args[0]?.includes?.("inside a test was not wrapped in act")
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// 각 테스트 후 모든 mock 초기화
afterEach(() => {
  jest.clearAllMocks();
});
