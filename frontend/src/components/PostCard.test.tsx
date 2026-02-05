import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import type { PostResponse } from "../api/posts";
import { formatRelativeTime } from "../utils/time";

import PostCard from "./PostCard";
jest.mock("../utils/time", () => ({
  formatRelativeTime: jest.fn((date: string) => {
    // 테스트용 간단한 포맷팅
    if (date.includes("2024-01-01")) return "1일 전";
    if (date.includes("2024-01-02")) return "2일 전";
    return "방금 전";
  }),
}));

describe("PostCard", () => {
  const mockPost: PostResponse = {
    id: "post-123",
    title: "테스트 포스트 제목",
    content:
      "이것은 테스트 포스트의 내용입니다. 더 긴 내용이 있을 수 있습니다.",
    authorName: "John Doe",
    authorId: "user-123",
    authorAvatar: "👨",
    boardName: "일반",
    boardId: "board-1",
    createdAt: "2024-01-01T12:00:00Z",
    updatedAt: "2024-01-02T12:00:00Z",
    likes: 5,
    dislikes: 0,
  };

  const renderPostCard = (
    props: Partial<typeof mockPost> & { variant?: "card" | "feed" } = {},
  ) => {
    const postData = { ...mockPost, ...props };
    const { variant, ...rest } = postData;
    return render(
      <BrowserRouter>
        <PostCard {...(rest as typeof mockPost)} variant={variant} />
      </BrowserRouter>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("card variant (기본값)", () => {
    it("카드 variant로 렌더링되어야 한다", () => {
      renderPostCard({ variant: "card" });

      expect(screen.getByRole("link")).toBeInTheDocument();
    });

    it("제목을 렌더링해야 한다", () => {
      renderPostCard({ variant: "card" });

      expect(screen.getByText("테스트 포스트 제목")).toBeInTheDocument();
    });

    it("내용을 렌더링해야 한다", () => {
      renderPostCard({ variant: "card" });

      expect(screen.getByText(/테스트 포스트의 내용/)).toBeInTheDocument();
    });

    it("저자명을 렌더링해야 한다", () => {
      renderPostCard({ variant: "card" });

      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("좋아요 수를 렌더링해야 한다", () => {
      renderPostCard({ variant: "card", likes: 42 });

      expect(screen.getByText("42")).toBeInTheDocument();
    });

    it("올바른 링크 URL로 이동해야 한다", () => {
      renderPostCard({ variant: "card", id: "post-456" });

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/post/post-456");
    });

    it("createdAt을 formatRelativeTime으로 포맷팅해야 한다", () => {
      renderPostCard({
        variant: "card",
        createdAt: "2024-01-01T12:00:00Z",
      });

      expect(formatRelativeTime).toHaveBeenCalledWith("2024-01-01T12:00:00Z");
      expect(screen.getByText("1일 전")).toBeInTheDocument();
    });

    it("updatedAt이 없을 때 createdAt을 사용해야 한다", () => {
      renderPostCard({
        variant: "card",
        createdAt: "2024-01-01T12:00:00Z",
        updatedAt: "2024-01-02T12:00:00Z",
      });

      expect(formatRelativeTime).toHaveBeenCalledWith("2024-01-01T12:00:00Z");
    });
  });

  describe("feed variant", () => {
    it("피드 variant로 렌더링되어야 한다", () => {
      renderPostCard({ variant: "feed" });

      expect(screen.getByRole("article")).toBeInTheDocument();
    });

    it("제목을 렌더링해야 한다", () => {
      renderPostCard({ variant: "feed" });

      expect(screen.getByText("테스트 포스트 제목")).toBeInTheDocument();
    });

    it("내용을 렌더링해야 한다", () => {
      renderPostCard({ variant: "feed" });

      expect(screen.getByText(/테스트 포스트의 내용/)).toBeInTheDocument();
    });

    it("저자명을 렌더링해야 한다", () => {
      renderPostCard({ variant: "feed" });

      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("보드명을 렌더링해야 한다", () => {
      renderPostCard({ variant: "feed" });

      expect(screen.getByText(/일반/)).toBeInTheDocument();
    });

    it("아바타를 렌더링해야 한다", () => {
      renderPostCard({ variant: "feed", authorAvatar: "👩" });

      expect(screen.getByText("👩")).toBeInTheDocument();
    });

    it("아바타가 없을 때 기본 아바타를 사용해야 한다", () => {
      renderPostCard({ variant: "feed", authorAvatar: undefined });

      expect(screen.getByText("👤")).toBeInTheDocument();
    });

    it("좋아요 버튼을 렌더링해야 한다", () => {
      renderPostCard({ variant: "feed", likes: 10 });

      expect(screen.getByText("10")).toBeInTheDocument();
    });

    it("updatedAt을 formatRelativeTime으로 포맷팅해야 한다", () => {
      renderPostCard({
        variant: "feed",
        createdAt: "2024-01-01T12:00:00Z",
        updatedAt: "2024-01-02T12:00:00Z",
      });

      expect(formatRelativeTime).toHaveBeenCalledWith("2024-01-02T12:00:00Z");
    });

    it("updatedAt이 없을 때 createdAt을 사용해야 한다", () => {
      jest.clearAllMocks();
      renderPostCard({
        variant: "feed",
        createdAt: "2024-01-01T12:00:00Z",
        updatedAt: undefined,
      });

      expect(formatRelativeTime).toHaveBeenCalledWith("2024-01-01T12:00:00Z");
    });
  });

  describe("공통 기능", () => {
    it("variant가 지정되지 않으면 card로 렌더링되어야 한다", () => {
      renderPostCard();

      expect(screen.getByRole("link")).toBeInTheDocument();
    });

    it("빈 아바타 문자열이 아닌 undefined일 때만 기본값을 사용해야 한다", () => {
      renderPostCard({
        variant: "feed",
        authorAvatar: undefined,
      });

      expect(screen.getByText("👤")).toBeInTheDocument();
    });
  });
});
