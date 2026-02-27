import { AxiosError } from "axios";

import { ApiError } from "./errors";
import * as followsApi from "./follows";

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

describe("Follows API", () => {
  const mockFollowResponse: followsApi.FollowResponse = {
    id: "follow-123",
    followerId: "user-123",
    followingId: "user-456",
    createdAt: "2026-02-26T00:00:00Z",
  };

  const mockFollowStatsResponse: followsApi.FollowStatsResponse = {
    userId: "user-456",
    followers: 100,
    following: 50,
  };

  const mockFollowUserInfo: followsApi.FollowUserInfo = {
    createdAt: "2026-02-26T00:00:00Z",
    user: {
      id: "user-456",
      name: "Target User",
      email: "target@example.com",
    },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("followUser", () => {
    it("should follow a user successfully", async () => {
      const userId = "user-456";

      (mockClient.post as jest.Mock).mockResolvedValue({
        data: mockFollowResponse,
      });

      const result = await followsApi.followUser(userId);

      expect(mockClient.post).toHaveBeenCalledWith("/follows", {
        followingId: userId,
      });
      expect(result).toEqual(mockFollowResponse);
    });

    it("should throw ApiError when follow fails", async () => {
      const userId = "user-456";

      const error = new AxiosError(
        "Conflict",
        "ERR_CONFLICT",
        undefined,
        undefined,
        {
          status: 409,
          statusText: "Conflict",
          data: { message: "이미 따라하고 있습니다." },
          headers: {},
          config: { url: "" } as any,
        } as any,
      );

      (mockClient.post as jest.Mock).mockRejectedValue(error);

      await expect(followsApi.followUser(userId)).rejects.toThrow(ApiError);
    });
  });

  describe("unfollowUser", () => {
    it("should unfollow a user successfully", async () => {
      const userId = "user-456";

      (mockClient.delete as jest.Mock).mockResolvedValue({
        data: undefined,
      });

      await followsApi.unfollowUser(userId);

      expect(mockClient.delete).toHaveBeenCalledWith(`/follows/${userId}`);
    });

    it("should throw ApiError when unfollow fails", async () => {
      const userId = "user-456";

      const error = new AxiosError(
        "Not Found",
        "ERR_NOT_FOUND",
        undefined,
        undefined,
        {
          status: 404,
          statusText: "Not Found",
          data: { message: "따라하고 있지 않습니다." },
          headers: {},
          config: { url: "" } as any,
        } as any,
      );

      (mockClient.delete as jest.Mock).mockRejectedValue(error);

      await expect(followsApi.unfollowUser(userId)).rejects.toThrow(ApiError);
    });
  });

  describe("getFollowers", () => {
    it("should get followers list for a user", async () => {
      const userId = "user-456";
      const mockFollowers = [mockFollowUserInfo];

      (mockClient.get as jest.Mock).mockResolvedValue({
        data: mockFollowers,
      });

      const result = await followsApi.getFollowers(userId);

      expect(mockClient.get).toHaveBeenCalledWith(
        `/follows/users/${userId}/followers`,
      );
      expect(result).toEqual(mockFollowers);
    });

    it("should handle error when fetching followers", async () => {
      const userId = "user-456";

      const error = new AxiosError(
        "Not Found",
        "ERR_NOT_FOUND",
        undefined,
        undefined,
        {
          status: 404,
          statusText: "Not Found",
          data: { message: "사용자를 찾을 수 없습니다." },
          headers: {},
          config: { url: "" } as any,
        } as any,
      );

      (mockClient.get as jest.Mock).mockRejectedValue(error);

      await expect(followsApi.getFollowers(userId)).rejects.toThrow(ApiError);
    });
  });

  describe("getFollowing", () => {
    it("should get following list for a user", async () => {
      const userId = "user-456";
      const mockFollowing = [mockFollowUserInfo];

      (mockClient.get as jest.Mock).mockResolvedValue({
        data: mockFollowing,
      });

      const result = await followsApi.getFollowing(userId);

      expect(mockClient.get).toHaveBeenCalledWith(
        `/follows/users/${userId}/following`,
      );
      expect(result).toEqual(mockFollowing);
    });

    it("should handle error when fetching following", async () => {
      const userId = "user-456";

      const error = new AxiosError(
        "Not Found",
        "ERR_NOT_FOUND",
        undefined,
        undefined,
        {
          status: 404,
          statusText: "Not Found",
          data: { message: "사용자를 찾을 수 없습니다." },
          headers: {},
          config: { url: "" } as any,
        } as any,
      );

      (mockClient.get as jest.Mock).mockRejectedValue(error);

      await expect(followsApi.getFollowing(userId)).rejects.toThrow(ApiError);
    });
  });

  describe("getFollowStats", () => {
    it("should get follow statistics for a user", async () => {
      const userId = "user-456";

      (mockClient.get as jest.Mock).mockResolvedValue({
        data: mockFollowStatsResponse,
      });

      const result = await followsApi.getFollowStats(userId);

      expect(mockClient.get).toHaveBeenCalledWith(
        `/follows/users/${userId}/stats`,
      );
      expect(result).toEqual(mockFollowStatsResponse);
      expect(result.followers).toBe(100);
      expect(result.following).toBe(50);
    });

    it("should handle error when fetching stats", async () => {
      const userId = "user-456";

      const error = new AxiosError(
        "Not Found",
        "ERR_NOT_FOUND",
        undefined,
        undefined,
        {
          status: 404,
          statusText: "Not Found",
          data: { message: "사용자를 찾을 수 없습니다." },
          headers: {},
          config: { url: "" } as any,
        } as any,
      );

      (mockClient.get as jest.Mock).mockRejectedValue(error);

      await expect(followsApi.getFollowStats(userId)).rejects.toThrow(ApiError);
    });
  });

  describe("isFollowing", () => {
    it("should return true when following a user", async () => {
      const userId = "user-456";

      (mockClient.get as jest.Mock).mockResolvedValue({
        data: { isFollowing: true },
      });

      const result = await followsApi.isFollowing(userId);

      expect(mockClient.get).toHaveBeenCalledWith(`/follows/${userId}`);
      expect(result).toBe(true);
    });

    it("should return false when not following a user", async () => {
      const userId = "user-456";

      (mockClient.get as jest.Mock).mockResolvedValue({
        data: { isFollowing: false },
      });

      const result = await followsApi.isFollowing(userId);

      expect(result).toBe(false);
    });

    it("should throw ApiError on check failure", async () => {
      const userId = "user-456";

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

      await expect(followsApi.isFollowing(userId)).rejects.toThrow(ApiError);
    });
  });
});
