import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import type { PostResponse } from "../api/posts";
import { formatRelativeTime } from "../utils/time";

import PostCard from "./PostCard";

jest.mock("../utils/time", () => ({
  formatRelativeTime: jest.fn((date: string) => {
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

    it("updatedAt이 있을 때도 createdAt을 사용해야 한다", () => {
      renderPostCard({
        variant: "card",
        createdAt: "2024-01-01T12:00:00Z",
        updatedAt: "2024-01-02T12:00:00Z",
      });

      expect(formatRelativeTime).toHaveBeenCalledWith("2024-01-01T12:00:00Z");
    });

    it("메시지 아이콘을 렌더링해야 한다", () => {
      const { container } = renderPostCard({ variant: "card" });

      const messageCircleIcons = container.querySelectorAll("svg");
      expect(messageCircleIcons.length).toBeGreaterThan(0);
    });

    it("좋아요 아이콘을 렌더링해야 한다", () => {
      const { container } = renderPostCard({ variant: "card" });

      const thumbsUpIcons = container.querySelectorAll("svg");
      expect(thumbsUpIcons.length).toBeGreaterThan(0);
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
      expect(screen.getByText("2일 전")).toBeInTheDocument();
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

    it("더보기 버튼을 렌더링해야 한다", () => {
      const { container } = renderPostCard({ variant: "feed" });

      const buttons = container.querySelectorAll("button");
      expect(buttons.length).toBeGreaterThan(0);
    });

    it("공유 버튼과 텍스트를 렌더링해야 한다", () => {
      renderPostCard({ variant: "feed" });

      expect(screen.getByText("공유")).toBeInTheDocument();
    });

    it("feed variant에서도 올바른 링크 URL을 가져야 한다", () => {
      renderPostCard({ variant: "feed", id: "post-789" });

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/post/post-789");
    });

    it("아바타가 빈 문자열일 때 기본 아바타를 사용해야 한다", () => {
      renderPostCard({ variant: "feed", authorAvatar: "" });

      expect(screen.getByText("👤")).toBeInTheDocument();
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

    it("0개의 좋아요를 렌더링해야 한다", () => {
      renderPostCard({ variant: "card", likes: 0 });

      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("큰 좋아요 수를 렌더링해야 한다", () => {
      renderPostCard({ variant: "card", likes: 999 });

      expect(screen.getByText("999")).toBeInTheDocument();
    });

    it("특수 문자가 포함된 제목을 렌더링해야 한다", () => {
      renderPostCard({
        variant: "card",
        title: '테스트 & <포스트> "제목"',
      });

      expect(screen.getByText(/테스트 & <포스트>/)).toBeInTheDocument();
    });

    it("매우 긴 내용을 렌더링해야 한다", () => {
      const longContent = "a".repeat(500);
      renderPostCard({ variant: "card", content: longContent });

      expect(screen.getByText(new RegExp(longContent))).toBeInTheDocument();
    });
  });
});
