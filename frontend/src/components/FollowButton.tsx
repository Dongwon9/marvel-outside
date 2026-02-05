import { UserPlus, UserMinus } from "lucide-react";
import { useEffect, useState } from "react";

import { ApiError } from "../api/errors";
import {
  followUser,
  unfollowUser,
  getFollowStats,
  isFollowing,
  getFollowers,
  getFollowing,
  type UserBasicInfo,
  type FollowStatsResponse,
} from "../api/follows";

interface FollowButtonProps {
  userId: string;
  onFollowChange?: () => void;
}

export function FollowButton({ userId, onFollowChange }: FollowButtonProps) {
  const [isFollowed, setIsFollowed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkFollowStatus() {
      try {
        const following = await isFollowing(userId);
        setIsFollowed(following);
      } catch {
        // 팔로우 상태 조회 실패는 무시
      }
    }

    void checkFollowStatus();
  }, [userId]);

  const handleFollow = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (isFollowed) {
        await unfollowUser(userId);
        setIsFollowed(false);
      } else {
        await followUser(userId);
        setIsFollowed(true);
      }
      onFollowChange?.();
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "팔로우 처리를 할 수 없습니다.";
      setError(message);
      console.error("Failed to toggle follow:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-1">
      <button
        onClick={() => void handleFollow()}
        disabled={isLoading}
        className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-colors ${
          isFollowed
            ? "text-secondary bg-gray-100 hover:bg-gray-200 disabled:bg-gray-100"
            : "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-600"
        }`}
      >
        {isFollowed ? (
          <UserMinus className="h-5 w-5" />
        ) : (
          <UserPlus className="h-5 w-5" />
        )}
        <span>{isFollowed ? "언팔로우" : "팔로우"}</span>
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

interface FollowStatsProps {
  userId: string;
}

export function FollowStats({ userId }: FollowStatsProps) {
  const [stats, setStats] = useState<FollowStatsResponse | null>(null);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getFollowStats(userId);
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch follow stats:", err);
      } finally {
        setIsPending(false);
      }
    }

    void fetchStats();
  }, [userId]);

  if (isPending) {
    return (
      <div className="text-tertiary flex gap-4">
        <div className="h-5 w-12 animate-pulse rounded bg-gray-200" />
        <div className="h-5 w-12 animate-pulse rounded bg-gray-200" />
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="flex gap-6">
      <div className="text-center">
        <div className="text-primary text-lg font-bold">{stats.followers}</div>
        <div className="text-muted text-sm">팔로워</div>
      </div>
      <div className="text-center">
        <div className="text-primary text-lg font-bold">{stats.following}</div>
        <div className="text-muted text-sm">팔로잉</div>
      </div>
    </div>
  );
}

interface FollowListProps {
  userId: string;
  type: "followers" | "following";
}

export function FollowList({ userId, type }: FollowListProps) {
  const [users, setUsers] = useState<UserBasicInfo[]>([]);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    async function fetchList() {
      try {
        const data =
          type === "followers"
            ? await getFollowers(userId)
            : await getFollowing(userId);
        setUsers(data);
      } catch (err) {
        console.error(`Failed to fetch ${type}:`, err);
      } finally {
        setIsPending(false);
      }
    }

    void fetchList();
  }, [userId, type]);

  if (isPending) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded bg-gray-200" />
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="rounded-lg bg-gray-50 p-6 text-center text-gray-600">
        {type === "followers"
          ? "팔로워가 없습니다."
          : "팔로잉 중인 사용자가 없습니다."}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-300" />
            <div>
              <div className="font-medium text-gray-900">{user.email}</div>
              <div className="text-xs text-gray-500">{user.id}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
