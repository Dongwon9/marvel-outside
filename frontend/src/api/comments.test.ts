import { AxiosError } from "axios";

import * as commentsApi from "./comments";
import { ApiError } from "./errors";

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

describe("Comments API", () => {
  const mockCommentResponse: commentsApi.CommentResponse = {
    content: "Great post!",
    createdAt: "2026-02-26T00:00:00Z",
    updatedAt: "2026-02-26T00:00:00Z",
    authorId: "user-123",
    postId: "post-456",
    author: {
      id: "user-123",
      name: "Test User",
    },
    post: {
      id: "post-456",
      title: "Test Post",
    },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createComment", () => {
    it("should create a comment successfully", async () => {
      const postId = "post-456";
      const commentForm = { content: "Great post!" };

      (mockClient.post as jest.Mock).mockResolvedValue({
        data: mockCommentResponse,
      });

      const result = await commentsApi.createComment(postId, commentForm);

      expect(mockClient.post).toHaveBeenCalledWith(
        `/posts/${postId}/comments`,
        commentForm,
      );
      expect(result).toEqual(mockCommentResponse);
    });

    it("should throw ApiError on creation failure", async () => {
      const postId = "post-456";
      const commentForm = { content: "Great post!" };

      const error = new AxiosError(
        "Bad Request",
        "ERR_BAD_REQUEST",
        undefined,
        undefined,
        {
          status: 400,
          statusText: "Bad Request",
          data: { message: "잘못된 요청입니다." },
          headers: {},
          config: { url: "" } as any,
        } as any,
      );

      (mockClient.post as jest.Mock).mockRejectedValue(error);

      await expect(
        commentsApi.createComment(postId, commentForm),
      ).rejects.toThrow(ApiError);
    });
  });

  describe("getCommentsByPost", () => {
    it("should get all comments for a post", async () => {
      const postId = "post-456";
      const mockComments = [mockCommentResponse];

      (mockClient.get as jest.Mock).mockResolvedValue({
        data: mockComments,
      });

      const result = await commentsApi.getCommentsByPost(postId);

      expect(mockClient.get).toHaveBeenCalledWith(`/posts/${postId}/comments`);
      expect(result).toEqual(mockComments);
    });

    it("should handle error when fetching comments", async () => {
      const postId = "post-456";

      const error = new AxiosError(
        "Not Found",
        "ERR_NOT_FOUND",
        undefined,
        undefined,
        {
          status: 404,
          statusText: "Not Found",
          data: { message: "데이터를 찾을 수 없습니다." },
          headers: {},
          config: { url: "" } as any,
        } as any,
      );

      (mockClient.get as jest.Mock).mockRejectedValue(error);

      await expect(commentsApi.getCommentsByPost(postId)).rejects.toThrow(
        ApiError,
      );
    });
  });

  describe("getMyComment", () => {
    it("should get user's own comment on a post", async () => {
      const postId = "post-456";

      (mockClient.get as jest.Mock).mockResolvedValue({
        data: mockCommentResponse,
      });

      const result = await commentsApi.getMyComment(postId);

      expect(mockClient.get).toHaveBeenCalledWith(
        `/posts/${postId}/comments/me`,
      );
      expect(result).toEqual(mockCommentResponse);
    });

    it("should return null when user has no comment on post", async () => {
      const postId = "post-456";

      const error = {
        message: "Not Found",
        response: {
          status: 404,
          statusText: "Not Found",
          data: { message: "데이터를 찾을 수 없습니다." },
          headers: {},
          config: { url: "" },
        },
        config: { url: "" },
      };

      Object.setPrototypeOf(error, AxiosError.prototype);
      (mockClient.get as jest.Mock).mockRejectedValue(error);

      const result = await commentsApi.getMyComment(postId);

      expect(result).toBeNull();
    });

    it("should throw ApiError on other failure scenarios", async () => {
      const postId = "post-456";

      const error = new AxiosError(
        "Unauthorized",
        "ERR_UNAUTHORIZED",
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

      await expect(commentsApi.getMyComment(postId)).rejects.toThrow(ApiError);
    });
  });

  describe("updateComment", () => {
    it("should update a comment successfully", async () => {
      const postId = "post-456";
      const updateForm = { content: "Updated content" };

      (mockClient.patch as jest.Mock).mockResolvedValue({
        data: { ...mockCommentResponse, content: "Updated content" },
      });

      const result = await commentsApi.updateComment(postId, updateForm);

      expect(mockClient.patch).toHaveBeenCalledWith(
        `/posts/${postId}/comments`,
        updateForm,
      );
      expect(result.content).toBe("Updated content");
    });

    it("should throw ApiError on update failure", async () => {
      const postId = "post-456";
      const updateForm = { content: "Updated content" };

      const error = new AxiosError(
        "Forbidden",
        "ERR_FORBIDDEN",
        undefined,
        undefined,
        {
          status: 403,
          statusText: "Forbidden",
          data: { message: "접근 권한이 없습니다." },
          headers: {},
          config: { url: "" } as any,
        } as any,
      );

      (mockClient.patch as jest.Mock).mockRejectedValue(error);

      await expect(
        commentsApi.updateComment(postId, updateForm),
      ).rejects.toThrow(ApiError);
    });
  });

  describe("deleteComment", () => {
    it("should delete a comment successfully", async () => {
      const postId = "post-456";

      (mockClient.delete as jest.Mock).mockResolvedValue({
        data: undefined,
      });

      await commentsApi.deleteComment(postId);

      expect(mockClient.delete).toHaveBeenCalledWith(
        `/posts/${postId}/comments`,
      );
    });

    it("should throw ApiError on deletion failure", async () => {
      const postId = "post-456";

      const error = new AxiosError(
        "Forbidden",
        "ERR_FORBIDDEN",
        undefined,
        undefined,
        {
          status: 403,
          statusText: "Forbidden",
          data: { message: "접근 권한이 없습니다." },
          headers: {},
          config: { url: "" } as any,
        } as any,
      );

      (mockClient.delete as jest.Mock).mockRejectedValue(error);

      await expect(commentsApi.deleteComment(postId)).rejects.toThrow(ApiError);
    });
  });

  describe("getUserComments", () => {
    it("should get all comments by a user", async () => {
      const userId = "user-123";
      const mockComments = [mockCommentResponse];

      (mockClient.get as jest.Mock).mockResolvedValue({
        data: mockComments,
      });

      const result = await commentsApi.getUserComments(userId);

      expect(mockClient.get).toHaveBeenCalledWith(`/users/${userId}/comments`);
      expect(result).toEqual(mockComments);
    });

    it("should handle error when fetching user comments", async () => {
      const userId = "user-123";

      const error = new AxiosError(
        "Not Found",
        "ERR_NOT_FOUND",
        undefined,
        undefined,
        {
          status: 404,
          statusText: "Not Found",
          data: { message: "데이터를 찾을 수 없습니다." },
          headers: {},
          config: { url: "" } as any,
        } as any,
      );

      (mockClient.get as jest.Mock).mockRejectedValue(error);

      await expect(commentsApi.getUserComments(userId)).rejects.toThrow(
        ApiError,
      );
    });
  });
});
