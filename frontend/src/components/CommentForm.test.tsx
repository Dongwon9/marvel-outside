import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";

import * as commentsApi from "../api/comments";

import CommentForm from "./CommentForm";

vi.mock("@/api/comments", () => ({
  createComment: vi.fn(),
  updateComment: vi.fn(),
}));

describe("CommentForm", () => {
  const mockOnSuccess = vi.fn();
  const mockOnCancel = vi.fn();
  const postId = "post-123";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("폼과 버튼을 렌더링해야 한다", () => {
    render(<CommentForm postId={postId} onSuccess={mockOnSuccess} />);

    expect(
      screen.getByPlaceholderText("댓글을 입력해주세요..."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "댓글 작성" }),
    ).toBeInTheDocument();
  });

  it("텍스트 입력이 가능해야 한다", async () => {
    const user = userEvent.setup();
    render(<CommentForm postId={postId} onSuccess={mockOnSuccess} />);

    const textarea = screen.getByPlaceholderText("댓글을 입력해주세요...");
    await user.type(textarea, "테스트 댓글");

    expect(textarea).toHaveValue("테스트 댓글");
  });

  it("빈 입력으로 제출 시 에러 메시지를 표시해야 한다", async () => {
    const user = userEvent.setup();
    render(<CommentForm postId={postId} onSuccess={mockOnSuccess} />);

    const submitButton = screen.getByRole("button", { name: "댓글 작성" });
    await user.click(submitButton);

    expect(screen.getByText("댓글 내용을 입력해주세요.")).toBeInTheDocument();
  });

  it("정상 입력으로 제출 시 API를 호출해야 한다", async () => {
    const user = userEvent.setup();
    vi.mocked(commentsApi.createComment).mockResolvedValue({
      content: "테스트 댓글",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authorId: "user-1",
      postId,
      author: { id: "user-1", name: "Test User" },
    });

    render(<CommentForm postId={postId} onSuccess={mockOnSuccess} />);

    const textarea = screen.getByPlaceholderText("댓글을 입력해주세요...");
    const submitButton = screen.getByRole("button", { name: "댓글 작성" });

    await user.type(textarea, "테스트 댓글");
    await user.click(submitButton);

    await waitFor(() => {
      expect(commentsApi.createComment).toHaveBeenCalledWith(postId, {
        content: "테스트 댓글",
      });
    });
  });

  it("API 호출 성공 시 onSuccess 콜백을 호출해야 한다", async () => {
    const user = userEvent.setup();
    vi.mocked(commentsApi.createComment).mockResolvedValue({
      content: "테스트 댓글",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authorId: "user-1",
      postId,
      author: { id: "user-1", name: "Test User" },
    });

    render(<CommentForm postId={postId} onSuccess={mockOnSuccess} />);

    await user.type(
      screen.getByPlaceholderText("댓글을 입력해주세요..."),
      "테스트",
    );
    await user.click(screen.getByRole("button", { name: "댓글 작성" }));

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it("API 호출 실패 시 에러 메시지를 표시해야 한다", async () => {
    const user = userEvent.setup();
    vi.mocked(commentsApi.createComment).mockRejectedValue(
      new Error("네트워크 에러"),
    );

    render(<CommentForm postId={postId} onSuccess={mockOnSuccess} />);

    await user.type(
      screen.getByPlaceholderText("댓글을 입력해주세요..."),
      "테스트",
    );
    await user.click(screen.getByRole("button", { name: "댓글 작성" }));

    await waitFor(() => {
      expect(screen.getByText("네트워크 에러")).toBeInTheDocument();
    });
  });

  it("로딩 중에 textarea가 disabled되어야 한다", async () => {
    const user = userEvent.setup();

    vi.mocked(commentsApi.createComment).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    );

    render(<CommentForm postId={postId} onSuccess={mockOnSuccess} />);

    const textarea = screen.getByPlaceholderText("댓글을 입력해주세요...");
    await user.type(textarea, "테스트");
    await user.click(screen.getByRole("button", { name: "댓글 작성" }));

    expect(textarea).toBeDisabled();

    await waitFor(() => {
      expect(textarea).not.toBeDisabled();
    });
  });

  it("isEdit이 true일 때 updateComment를 호출해야 한다", async () => {
    const user = userEvent.setup();
    vi.mocked(commentsApi.updateComment).mockResolvedValue({
      content: "수정된 댓글",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authorId: "user-1",
      postId,
      author: { id: "user-1", name: "Test User" },
    });

    render(
      <CommentForm
        postId={postId}
        initialContent="원본 댓글"
        isEdit={true}
        onSuccess={mockOnSuccess}
      />,
    );

    const textarea = screen.getByPlaceholderText("댓글을 입력해주세요...");
    expect(textarea).toHaveValue("원본 댓글");

    await user.clear(textarea);
    await user.type(textarea, "수정된 댓글");
    await user.click(screen.getByRole("button", { name: "수정" }));

    await waitFor(() => {
      expect(commentsApi.updateComment).toHaveBeenCalledWith(postId, {
        content: "수정된 댓글",
      });
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it("onCancel이 전달되었을 때 Cancel 버튼을 렌더링해야 한다", () => {
    render(
      <CommentForm
        postId={postId}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />,
    );

    expect(screen.getByRole("button", { name: "취소" })).toBeInTheDocument();
  });

  it("Cancel 버튼 클릭 시 onCancel을 호출해야 한다", async () => {
    const user = userEvent.setup();
    render(
      <CommentForm
        postId={postId}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />,
    );

    await user.click(screen.getByRole("button", { name: "취소" }));

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it("전송 성공 후 입력창이 초기화되어야 한다", async () => {
    const user = userEvent.setup();
    vi.mocked(commentsApi.createComment).mockResolvedValue({
      content: "테스트 댓글",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authorId: "user-1",
      postId,
      author: { id: "user-1", name: "Test User" },
    });

    render(<CommentForm postId={postId} onSuccess={mockOnSuccess} />);

    const textarea = screen.getByPlaceholderText("댓글을 입력해주세요...");
    await user.type(textarea, "테스트 댓글");
    await user.click(screen.getByRole("button", { name: "댓글 작성" }));

    await waitFor(() => {
      expect(textarea).toHaveValue("");
    });
  });
});
