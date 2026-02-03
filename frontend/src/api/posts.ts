import { AxiosError } from "axios";
import client from "./client";
import { ApiError, getErrorMessage } from "./errors";

function getStatusCode(error: unknown): number {
  if (error instanceof AxiosError) {
    return error.response?.status || 500;
  }
  return 500;
}

export interface PostForm {
  title: string;
  content: string;
  boardId: string;
  authorId?: string;
}
export interface PostsQueryForm {
  boardId?: string;
  authorId?: string;
  search?: string;
  take?: number;
  offset?: number;
  orderBy?: { field: string; direction: "asc" | "desc" };
}
export interface PostResponse {
  authorAvatar: string | undefined;
  id: string;
  title: string;
  content: string;
  boardId: string;
  boardName: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
  likes: number;
  dislikes: number;
}

export interface PostStatsResponse {
  postId: string;
  likes: number;
  dislikes: number;
}

export async function getPostById(id: string): Promise<PostResponse> {
  try {
    const response = await client.get<PostResponse>(`/posts/${id}`);
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    throw new ApiError(getStatusCode(error), message, error);
  }
}

export async function createPost(data: PostForm): Promise<PostResponse> {
  try {
    const response = await client.post<PostResponse>("/posts", data);
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    throw new ApiError(getStatusCode(error), message, error);
  }
}

export async function updatePost(
  id: string,
  data: PostForm,
): Promise<PostResponse> {
  try {
    const response = await client.patch<PostResponse>(`/posts/${id}`, data);
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    throw new ApiError(getStatusCode(error), message, error);
  }
}

export async function deletePost(id: string): Promise<void> {
  try {
    await client.delete(`/posts/${id}`);
  } catch (error) {
    const message = getErrorMessage(error);
    throw new ApiError(getStatusCode(error), message, error);
  }
}

export async function increasePostViews(id: string): Promise<PostResponse> {
  try {
    const response = await client.patch<PostResponse>(`/posts/${id}/views`);
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    throw new ApiError(getStatusCode(error), message, error);
  }
}

export async function getPostStats(id: string): Promise<PostStatsResponse> {
  try {
    const response = await client.get<PostStatsResponse>(`/posts/${id}/stats`);
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    throw new ApiError(getStatusCode(error), message, error);
  }
}

export async function getPosts(
  query?: PostsQueryForm,
): Promise<PostResponse[]> {
  try {
    const response = await client.get<PostResponse[]>("/posts", {
      params: query,
    });
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    throw new ApiError(getStatusCode(error), message, error);
  }
}
