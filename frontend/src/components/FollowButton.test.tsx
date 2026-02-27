import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";

import * as followsApi from "@/api/follows";
import { AuthContext } from "@/context/AuthContextDef";
import type { AuthContextType } from "@/context/AuthContextDef";

import { FollowButton } from "./FollowButton";

jest.mock("@/api/follows");

const mockFollowUser = followsApi.followUser as jest.Mock;
const mockUnfollowUser = followsApi.unfollowUser as jest.Mock;
const mockIsFollowing = followsApi.isFollowing as jest.Mock;

describe("FollowButton", () => {
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
    <AuthContext.Provider value={mockAuth}>{children}</AuthContext.Provider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    mockIsFollowing.mockResolvedValue(false);
    mockFollowUser.mockResolvedValue({});
    mockUnfollowUser.mockResolvedValue({});
  });

  it("should render follow button initially", async () => {
    render(<FollowButton userId="user-456" />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText("팔로우")).toBeInTheDocument();
    });
  });

  it("should render unfollow button when already following", async () => {
    mockIsFollowing.mockResolvedValue(true);

    render(<FollowButton userId="user-456" />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText("언팔로우")).toBeInTheDocument();
    });
  });

  it("should follow user when follow button clicked", async () => {
    render(<FollowButton userId="user-456" />, { wrapper });

    const followButton = await screen.findByText("팔로우");
    fireEvent.click(followButton);

    await waitFor(() => {
      expect(mockFollowUser).toHaveBeenCalledWith("user-456");
      expect(screen.getByText("언팔로우")).toBeInTheDocument();
    });
  });

  it("should unfollow user when unfollow button clicked", async () => {
    mockIsFollowing.mockResolvedValue(true);

    render(<FollowButton userId="user-456" />, { wrapper });

    const unfollowButton = await screen.findByText("언팔로우");
    fireEvent.click(unfollowButton);

    await waitFor(() => {
      expect(mockUnfollowUser).toHaveBeenCalledWith("user-456");
    });
  });

  it("should display error message on follow failure", async () => {
    mockFollowUser.mockRejectedValue(new Error("Failed to follow"));

    render(<FollowButton userId="user-456" />, { wrapper });

    const followButton = await screen.findByText("팔로우");
    fireEvent.click(followButton);

    await waitFor(() => {
      expect(
        screen.getByText(/팔로우 처리를 할 수 없습니다/),
      ).toBeInTheDocument();
    });
  });

  it("should call onFollowChange when follow state changes", async () => {
    const onFollowChange = jest.fn();

    render(<FollowButton userId="user-456" onFollowChange={onFollowChange} />, {
      wrapper,
    });

    const followButton = await screen.findByText("팔로우");
    fireEvent.click(followButton);

    await waitFor(() => {
      expect(onFollowChange).toHaveBeenCalled();
    });
  });
});
