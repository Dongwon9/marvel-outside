import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";

import CommentItem from "./CommentItem";
import * as commentsApi from "@/api/comments";
import { AuthContext } from "@/context/AuthContextDef";
import type { AuthContextType } from "@/context/AuthContextDef";

jest.mock("@/api/comments");
jest.mock("./CommentForm", () => {
  return function MockCommentForm() {
    return <div data-testid="comment-form-mock">Comment Form</div>;
  };
});

const mockDeleteComment = commentsApi.deleteComment as jest.Mock;

describe("CommentItem", () => {
  const mockComment: commentsApi.CommentResponse = {
    content: "Great post!",
    createdAt: "2026-02-26T10:00:00Z",
    updatedAt: "2026-02-26T10:00:00Z",
    authorId: "user-123",
    postId: "post-456",
    author: {
      id: "user-123",
      name: "Comment Author",
    },
    post: {
      id: "post-456",
      title: "Test Post",
    },
  };

  const mockOwnerAuth: AuthContextType = {
    user: {
      id: "user-123",
      email: "owner@example.com",
      name: "Owner",
    },
    isLoading: false,
    logout: jest.fn(),
    isLoggedIn: true,
    refetchUser: jest.fn(),
  };

  const mockOtherAuth: AuthContextType = {
    user: {
      id: "user-789",
      email: "viewer@example.com",
      name: "Viewer",
    },
    isLoading: false,
    logout: jest.fn(),
    isLoggedIn: true,
    refetchUser: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockDeleteComment.mockResolvedValue(undefined);
  });

  it("should render comment with author info and content", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthContext.Provider value={mockOwnerAuth}>
        {children}
      </AuthContext.Provider>
    );

    render(
      <CommentItem comment={mockComment} onCommentUpdated={jest.fn()} />,
      { wrapper }
    );

    expect(screen.getByText("Comment Author")).toBeInTheDocument();
    expect(screen.getByText("Great post!")).toBeInTheDocument();
  });

  it("should not show edit/delete buttons when not owner", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthContext.Provider value={mockOtherAuth}>
        {children}
      </AuthContext.Provider>
    );

    render(
      <CommentItem comment={mockComment} onCommentUpdated={jest.fn()} />,
      { wrapper }
    );

    expect(screen.queryByText("수정")).not.toBeInTheDocument();
    expect(screen.queryByText("삭제")).not.toBeInTheDocument();
  });

  it("should show edit/delete buttons when owner", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthContext.Provider value={mockOwnerAuth}>
        {children}
      </AuthContext.Provider>
    );

    render(
      <CommentItem comment={mockComment} onCommentUpdated={jest.fn()} />,
      { wrapper }
    );

    expect(screen.getByText("수정")).toBeInTheDocument();
    expect(screen.getByText("삭제")).toBeInTheDocument();
  });

  it("should show edit form when edit button clicked", async () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthContext.Provider value={mockOwnerAuth}>
        {children}
      </AuthContext.Provider>
    );

    render(
      <CommentItem comment={mockComment} onCommentUpdated={jest.fn()} />,
      { wrapper }
    );

    const editButton = screen.getByText("수정");
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByTestId("comment-form-mock")).toBeInTheDocument();
    });
  });

  it("should delete comment and call onCommentUpdated", async () => {
    const onCommentUpdated = jest.fn();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthContext.Provider value={mockOwnerAuth}>
        {children}
      </AuthContext.Provider>
    );

    render(
      <CommentItem
        comment={mockComment}
        onCommentUpdated={onCommentUpdated}
      />,
      { wrapper }
    );

    // Mock window.confirm
    window.confirm = jest.fn(() => true);

    const deleteButton = screen.getByText("삭제");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockDeleteComment).toHaveBeenCalledWith(mockComment.postId);
      expect(onCommentUpdated).toHaveBeenCalled();
    });
  });

  it("should not delete when confirm is cancelled", async () => {
    const onCommentUpdated = jest.fn();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthContext.Provider value={mockOwnerAuth}>
        {children}
      </AuthContext.Provider>
    );

    render(
      <CommentItem
        comment={mockComment}
        onCommentUpdated={onCommentUpdated}
      />,
      { wrapper }
    );

    window.confirm = jest.fn(() => false);

    const deleteButton = screen.getByText("삭제");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockDeleteComment).not.toHaveBeenCalled();
      expect(onCommentUpdated).not.toHaveBeenCalled();
    });
  });

  it("should display error message on deletion failure", async () => {
    const onCommentUpdated = jest.fn();
    const errorMessage = "댓글 삭제에 실패했습니다.";
    mockDeleteComment.mockRejectedValueOnce(new Error(errorMessage));

    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthContext.Provider value={mockOwnerAuth}>
        {children}
      </AuthContext.Provider>
    );

    render(
      <CommentItem
        comment={mockComment}
        onCommentUpdated={onCommentUpdated}
      />,
      { wrapper }
    );

    window.confirm = jest.fn(() => true);

    const deleteButton = screen.getByText("삭제");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
