import { AxiosError } from "axios";

import client from "./client";
import { ApiError, getErrorMessage } from "./errors";

export interface User {
  id: string;
  email: string;
  name: string;
  registeredAt: Date;
  deletedAt: Date | null;
  emailVerifiedAt: Date | null;
}

export interface UserStats {
  postCount: number;
  commentCount: number;
  followerCount: number;
  followingCount: number;
  likedCount: number;
}

function getStatusCode(error: unknown): number {
  if (error instanceof AxiosError) {
    return error.response?.status || 500;
  }
  return 500;
}

export async function getUserById(userId: string): Promise<User> {
  try {
    const response = await client.get<User>(`/users/${userId}`);
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    throw new ApiError(getStatusCode(error), message, error);
  }
}

export async function getUserStats(userId: string): Promise<UserStats> {
  try {
    const response = await client.get<UserStats>(`/users/${userId}/stats`);
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    throw new ApiError(getStatusCode(error), message, error);
  }
}
