import { AxiosError } from "axios";
import client from "./client";
import { ApiError, getErrorMessage } from "./errors";

export interface FollowResponse {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
}

export interface FollowStatsResponse {
  userId: string;
  followers: number;
  following: number;
}

export interface UserBasicInfo {
  id: string;
  email: string;
  avatar?: string;
}

function getStatusCode(error: unknown): number {
  if (error instanceof AxiosError) {
    return error.response?.status || 500;
  }
  return 500;
}

/**
 * 사용자 팔로우
 */
export async function followUser(userId: string): Promise<FollowResponse> {
  try {
    const response = await client.post<FollowResponse>("/follows", {
      followingId: userId,
    });
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    throw new ApiError(getStatusCode(error), message, error);
  }
}

/**
 * 사용자 언팔로우
 */
export async function unfollowUser(userId: string): Promise<void> {
  try {
    await client.delete(`/follows/${userId}`);
  } catch (error) {
    const message = getErrorMessage(error);
    throw new ApiError(getStatusCode(error), message, error);
  }
}

/**
 * 팔로워 목록 조회
 */
export async function getFollowers(userId: string): Promise<UserBasicInfo[]> {
  try {
    const response = await client.get<UserBasicInfo[]>(
      `/follows/users/${userId}/followers`,
    );
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    throw new ApiError(getStatusCode(error), message, error);
  }
}

/**
 * 팔로잉 목록 조회
 */
export async function getFollowing(userId: string): Promise<UserBasicInfo[]> {
  try {
    const response = await client.get<UserBasicInfo[]>(
      `/follows/users/${userId}/following`,
    );
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    throw new ApiError(getStatusCode(error), message, error);
  }
}

/**
 * 팔로우 통계 조회 (팔로워, 팔로잉 수)
 */
export async function getFollowStats(
  userId: string,
): Promise<FollowStatsResponse> {
  try {
    const response = await client.get<FollowStatsResponse>(
      `/follows/users/${userId}/stats`,
    );
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    throw new ApiError(getStatusCode(error), message, error);
  }
}

/**
 * 팔로우 여부 확인
 */
export async function isFollowing(userId: string): Promise<boolean> {
  try {
    const response = await client.get<{ isFollowing: boolean }>(
      `/follows/${userId}`,
    );
    return response.data.isFollowing;
  } catch (error) {
    const message = getErrorMessage(error);
    throw new ApiError(getStatusCode(error), message, error);
  }
}
