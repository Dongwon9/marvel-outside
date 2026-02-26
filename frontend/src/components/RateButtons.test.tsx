import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { type ReactNode } from "react";

import RateButtons from "./RateButtons";
import * as ratesApi from "@/api/rates";
import { AuthContext } from "@/context/AuthContextDef";
import type { AuthContextType } from "@/context/AuthContextDef";

jest.mock("@/api/rates");

const mockCreateRate = ratesApi.createRate as jest.Mock;
const mockDeleteRate = ratesApi.deleteRate as jest.Mock;
const mockUpdateRate = ratesApi.updateRate as jest.Mock;

describe("RateButtons", () => {
  const mockAuth: AuthContextType = {
    user: {
      id: "user-123",
      email: "test@example.com",
      name: "Test User",
    },
    isLoading: false,
    logout: jest.fn(),
    isLoggedIn: true,
    refetchUser: jest.fn(),
  };

  const wrapper = ({ children }: { children: ReactNode }) => (
    <AuthContext.Provider value={mockAuth}>
      {children}
    </AuthContext.Provider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateRate.mockResolvedValue({
      userId: "user-123",
      postId: "post-456",
      isLike: true,
    });
    mockDeleteRate.mockResolvedValue({});
    mockUpdateRate.mockResolvedValue({
      userId: "user-123",
      postId: "post-456",
      isLike: false,
    });
  });

  it("should render like and dislike buttons with counts", () => {
    render(
      <RateButtons
        postId="post-456"
        initialLikes={10}
        initialDislikes={2}
      />,
      { wrapper }
    );

    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("should add like when like button clicked", async () => {
    const onRateChange = jest.fn();

    render(
      <RateButtons
        postId="post-456"
        initialLikes={10}
        initialDislikes={2}
        onRateChange={onRateChange}
      />,
      { wrapper }
    );

    const likeButtons = screen.getAllByRole("button");
    fireEvent.click(likeButtons[0]); // First button is like

    await waitFor(() => {
      expect(mockCreateRate).toHaveBeenCalledWith({
        userId: "user-123",
        postId: "post-456",
        isLike: true,
      });
      expect(onRateChange).toHaveBeenCalledWith(11, 2);
    });
  });

  it("should remove like when like button clicked again", async () => {
    mockDeleteRate.mockResolvedValue({});
    const userRate: ratesApi.RateResponse = {
      userId: "user-123",
      postId: "post-456",
      isLike: true,
    };

    const onRateChange = jest.fn();

    render(
      <RateButtons
        postId="post-456"
        initialLikes={11}
        initialDislikes={2}
        userRate={userRate}
        onRateChange={onRateChange}
      />,
      { wrapper }
    );

    const likeButtons = screen.getAllByRole("button");
    fireEvent.click(likeButtons[0]);

    await waitFor(() => {
      expect(mockDeleteRate).toHaveBeenCalledWith("user-123", "post-456");
      expect(onRateChange).toHaveBeenCalledWith(10, 2);
    });
  });

  it("should change from like to dislike", async () => {
    const userRate: ratesApi.RateResponse = {
      userId: "user-123",
      postId: "post-456",
      isLike: true,
    };

    const onRateChange = jest.fn();

    render(
      <RateButtons
        postId="post-456"
        initialLikes={11}
        initialDislikes={2}
        userRate={userRate}
        onRateChange={onRateChange}
      />,
      { wrapper }
    );

    const dislikeButton = screen.getAllByRole("button")[1];
    fireEvent.click(dislikeButton);

    await waitFor(() => {
      expect(mockUpdateRate).toHaveBeenCalledWith("user-123", "post-456", {
        isLike: false,
      });
      expect(onRateChange).toHaveBeenCalled();
    });
  });

  it("should display error message on rate failure", async () => {
    mockCreateRate.mockRejectedValue(new Error("Rate failed"));

    render(
      <RateButtons
        postId="post-456"
        initialLikes={10}
        initialDislikes={2}
      />,
      { wrapper }
    );

    const likeButtons = screen.getAllByRole("button");
    fireEvent.click(likeButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/평가를 처리할 수 없습니다/)).toBeInTheDocument();
    });
  });

  it("should disable buttons when user is not logged in", () => {
    const noAuthWrapper = ({ children }: { children: ReactNode }) => (
      <AuthContext.Provider
        value={{
          user: null,
          isLoading: false,
          logout: jest.fn(),
          isLoggedIn: false,
          refetchUser: jest.fn(),
        }}
      >
        {children}
      </AuthContext.Provider>
    );

    render(
      <RateButtons
        postId="post-456"
        initialLikes={10}
        initialDislikes={2}
      />,
      { wrapper: noAuthWrapper }
    );

    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });
});
