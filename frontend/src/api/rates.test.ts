import { AxiosError } from "axios";

import { ApiError } from "./errors";
import * as ratesApi from "./rates";

jest.mock("./client", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

import client from "./client";

const mockClient = client as jest.Mocked<typeof client>;

describe("Rates API", () => {
  const mockRateResponse: ratesApi.RateResponse = {
    userId: "user-123",
    postId: "post-456",
    isLike: true,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createRate", () => {
    it("should create a like rating successfully", async () => {
      const createData: ratesApi.CreateRateRequest = {
        userId: "user-123",
        postId: "post-456",
        isLike: true,
      };

      (mockClient.post as jest.Mock).mockResolvedValue({
        data: mockRateResponse,
      });

      const result = await ratesApi.createRate(createData);

      expect(mockClient.post).toHaveBeenCalledWith("/rates", createData);
      expect(result).toEqual(mockRateResponse);
      expect(result.isLike).toBe(true);
    });

    it("should create a dislike rating successfully", async () => {
      const createData: ratesApi.CreateRateRequest = {
        userId: "user-123",
        postId: "post-456",
        isLike: false,
      };

      const dislikeResponse = { ...mockRateResponse, isLike: false };

      (mockClient.post as jest.Mock).mockResolvedValue({
        data: dislikeResponse,
      });

      const result = await ratesApi.createRate(createData);

      expect(result.isLike).toBe(false);
    });

    it("should throw ApiError when rating creation fails", async () => {
      const createData: ratesApi.CreateRateRequest = {
        userId: "user-123",
        postId: "post-456",
        isLike: true,
      };

      const error = new AxiosError(
        "Conflict",
        "ERR_CONFLICT",
        undefined,
        undefined,
        {
          status: 409,
          statusText: "Conflict",
          data: { message: "이미 평가했습니다." },
          headers: {},
          config: { url: "" } as any,
        } as any,
      );

      (mockClient.post as jest.Mock).mockRejectedValue(error);

      await expect(ratesApi.createRate(createData)).rejects.toThrow(ApiError);
    });
  });

  describe("getRates", () => {
    it("should get all rates without filter", async () => {
      const mockRates = [mockRateResponse];

      (mockClient.get as jest.Mock).mockResolvedValue({
        data: mockRates,
      });

      const result = await ratesApi.getRates();

      expect(mockClient.get).toHaveBeenCalledWith("/rates", {
        params: undefined,
      });
      expect(result).toEqual(mockRates);
    });

    it("should get rates for a specific post", async () => {
      const postId = "post-456";
      const mockRates = [mockRateResponse];

      (mockClient.get as jest.Mock).mockResolvedValue({
        data: mockRates,
      });

      const result = await ratesApi.getRates(postId);

      expect(mockClient.get).toHaveBeenCalledWith("/rates", {
        params: { postId },
      });
      expect(result).toEqual(mockRates);
    });

    it("should handle error when fetching rates", async () => {
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

      (mockClient.get as jest.Mock).mockRejectedValue(error);

      await expect(ratesApi.getRates()).rejects.toThrow(ApiError);
    });
  });

  describe("getRateByPostAndUserId", () => {
    it("should get rate for a specific user and post", async () => {
      const userId = "user-123";
      const postId = "post-456";

      (mockClient.get as jest.Mock).mockResolvedValue({
        data: mockRateResponse,
      });

      const result = await ratesApi.getRateByPostAndUserId(postId, userId);

      expect(mockClient.get).toHaveBeenCalledWith(`/rates/${userId}/${postId}`);
      expect(result).toEqual(mockRateResponse);
    });

    it("should throw ApiError when rate not found", async () => {
      const userId = "user-123";
      const postId = "post-456";

      const error = new AxiosError(
        "Not Found",
        "ERR_NOT_FOUND",
        undefined,
        undefined,
        {
          status: 404,
          statusText: "Not Found",
          data: { message: "평가를 찾을 수 없습니다." },
          headers: {},
          config: { url: "" } as any,
        } as any,
      );

      (mockClient.get as jest.Mock).mockRejectedValue(error);

      await expect(
        ratesApi.getRateByPostAndUserId(postId, userId),
      ).rejects.toThrow(ApiError);
    });
  });

  describe("updateRate", () => {
    it("should update rating from like to dislike", async () => {
      const userId = "user-123";
      const postId = "post-456";
      const updateData: ratesApi.UpdateRateRequest = { isLike: false };

      const updatedResponse = { ...mockRateResponse, isLike: false };

      (mockClient.patch as jest.Mock).mockResolvedValue({
        data: updatedResponse,
      });

      const result = await ratesApi.updateRate(userId, postId, updateData);

      expect(mockClient.patch).toHaveBeenCalledWith(
        `/rates/${userId}/${postId}`,
        updateData,
      );
      expect(result.isLike).toBe(false);
    });

    it("should throw ApiError when update fails", async () => {
      const userId = "user-123";
      const postId = "post-456";
      const updateData: ratesApi.UpdateRateRequest = { isLike: false };

      const error = new AxiosError(
        "Not Found",
        "ERR_NOT_FOUND",
        undefined,
        undefined,
        {
          status: 404,
          statusText: "Not Found",
          data: { message: "평가를 찾을 수 없습니다." },
          headers: {},
          config: { url: "" } as any,
        } as any,
      );

      (mockClient.patch as jest.Mock).mockRejectedValue(error);

      await expect(
        ratesApi.updateRate(userId, postId, updateData),
      ).rejects.toThrow(ApiError);
    });
  });

  describe("deleteRate", () => {
    it("should successfully delete a rating", async () => {
      const userId = "user-123";
      const postId = "post-456";

      (mockClient.delete as jest.Mock).mockResolvedValue({
        data: mockRateResponse,
      });

      const result = await ratesApi.deleteRate(userId, postId);

      expect(mockClient.delete).toHaveBeenCalledWith(
        `/rates/${userId}/${postId}`,
      );
      expect(result).toEqual(mockRateResponse);
    });

    it("should throw ApiError when deletion fails", async () => {
      const userId = "user-123";
      const postId = "post-456";

      const error = new AxiosError(
        "Not Found",
        "ERR_NOT_FOUND",
        undefined,
        undefined,
        {
          status: 404,
          statusText: "Not Found",
          data: { message: "평가를 찾을 수 없습니다." },
          headers: {},
          config: { url: "" } as any,
        } as any,
      );

      (mockClient.delete as jest.Mock).mockRejectedValue(error);

      await expect(ratesApi.deleteRate(userId, postId)).rejects.toThrow(
        ApiError,
      );
    });
  });
});
