import { AxiosError } from "axios";

import * as authApi from "./auth";

jest.mock("./client", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  },
}));

import client from "./client";

const mockClient = client as jest.Mocked<typeof client>;

describe("Auth API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("should successfully login with valid credentials", async () => {
      const loginData = {
        email: "test@example.com",
        password: "password123",
        rememberMe: false,
      };
      const mockResponse = { message: "Login successful" };

      (mockClient.post as jest.Mock).mockResolvedValue({
        data: mockResponse,
      });

      const result = await authApi.login(loginData);

      expect(mockClient.post).toHaveBeenCalledWith("/auth/login", loginData);
      expect(result).toEqual(mockResponse);
    });

    it("should throw ApiError on login failure", async () => {
      const loginData = {
        email: "test@example.com",
        password: "wrongpassword",
        rememberMe: false,
      };

      const error = new AxiosError(
        "Unauthorized",
        "ERR_UNAUTH",
        undefined,
        undefined,
        {
          status: 401,
          statusText: "Unauthorized",
          data: { message: "이메일 또는 비밀번호가 올바르지 않습니다." },
          headers: {},
          config: { url: "" } as any,
        } as any,
      );

      (mockClient.post as jest.Mock).mockRejectedValue(error);

      await expect(authApi.login(loginData)).rejects.toThrow();
    });
  });

  describe("signup", () => {
    it("should successfully signup with valid data", async () => {
      const signupData = {
        email: "newuser@example.com",
        name: "New User",
        password: "password123",
      };

      (mockClient.post as jest.Mock).mockResolvedValue({ data: undefined });

      await authApi.signup(signupData);

      expect(mockClient.post).toHaveBeenCalledWith("/users", signupData);
    });

    it("should throw ApiError when email already exists", async () => {
      const signupData = {
        email: "existing@example.com",
        name: "User",
        password: "password123",
      };

      const error = new AxiosError(
        "Conflict",
        "ERR_CONFLICT",
        undefined,
        undefined,
        {
          status: 409,
          statusText: "Conflict",
          data: { message: "이미 존재하는 정보입니다." },
          headers: {},
          config: { url: "" } as any,
        } as any,
      );

      (mockClient.post as jest.Mock).mockRejectedValue(error);

      await expect(authApi.signup(signupData)).rejects.toThrow();
    });
  });

  describe("logout", () => {
    it("should successfully logout", async () => {
      (mockClient.post as jest.Mock).mockResolvedValue({ data: undefined });

      await authApi.logout();

      expect(mockClient.post).toHaveBeenCalledWith("/auth/logout");
    });

    it("should handle logout failure gracefully", async () => {
      const error = new AxiosError(
        "Server Error",
        "ERR_SERVER",
        undefined,
        undefined,
        {
          status: 500,
          statusText: "Internal Server Error",
          data: { message: "서버 오류가 발생했습니다." },
          headers: {},
          config: { url: "" } as any,
        } as any,
      );

      (mockClient.post as jest.Mock).mockRejectedValue(error);

      await expect(authApi.logout()).rejects.toThrow();
    });
  });

  describe("getMe", () => {
    it("should return current user info", async () => {
      const mockMeData = {
        id: "user-123",
        email: "test@example.com",
        name: "Test User",
      };

      (mockClient.get as jest.Mock).mockResolvedValue({
        data: mockMeData,
      });

      const result = await authApi.getMe();

      expect(mockClient.get).toHaveBeenCalledWith("/auth/me");
      expect(result).toEqual(mockMeData);
    });

    it("should handle getMe error", async () => {
      const error = new AxiosError(
        "Unauthorized",
        "ERR_UNAUTH",
        undefined,
        undefined,
        {
          status: 401,
          statusText: "Unauthorized",
          data: { message: "인증되지 않은 요청입니다." },
          headers: {},
          config: { url: "" } as any,
        } as any,
      );

      (mockClient.get as jest.Mock).mockRejectedValue(error);

      await expect(authApi.getMe()).rejects.toThrow();
    });
  });

  describe("deleteAccount", () => {
    it("should successfully delete user account", async () => {
      (mockClient.delete as jest.Mock).mockResolvedValue({
        data: undefined,
      });

      await authApi.deleteAccount();

      expect(mockClient.delete).toHaveBeenCalledWith("/users");
    });

    it("should handle deleteAccount failure", async () => {
      const error = new AxiosError(
        "Server Error",
        "ERR_SERVER",
        undefined,
        undefined,
        {
          status: 500,
          statusText: "Internal Server Error",
          data: { message: "서버 오류가 발생했습니다." },
          headers: {},
          config: { url: "" } as any,
        } as any,
      );

      (mockClient.delete as jest.Mock).mockRejectedValue(error);

      await expect(authApi.deleteAccount()).rejects.toThrow();
    });
  });
});
