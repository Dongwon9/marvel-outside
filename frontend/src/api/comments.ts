import { AxiosError } from "axios";

import client from "./client";
import { ApiError, getErrorMessage } from "./errors";

export interface CommentForm {
  content: string;
}

export interface CommentResponse {
  content: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  postId: string;
  author: {
    id: string;
    name: string;
  };
}

export async function createComment(
  postId: string,
  form: CommentForm,
): Promise<CommentResponse> {
  try {
    const response = await client.post<CommentResponse>(
      `/posts/${postId}/comments`,
      form,
    );
    return response.data;
  } catch (error) {
    throw new ApiError(getStatusCode(error), getErrorMessage(error));
  }
}

export async function getCommentsByPost(
  postId: string,
): Promise<CommentResponse[]> {
  try {
    const response = await client.get<CommentResponse[]>(
      `/posts/${postId}/comments`,
    );
    return response.data;
  } catch (error) {
    throw new ApiError(getStatusCode(error), getErrorMessage(error));
  }
}

export async function getMyComment(
  postId: string,
): Promise<CommentResponse | null> {
  try {
    const response = await client.get<CommentResponse>(
      `/posts/${postId}/comments/me`,
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return null;
    }
    throw new ApiError(getStatusCode(error), getErrorMessage(error));
  }
}

export async function updateComment(
  postId: string,
  form: Partial<CommentForm>,
): Promise<CommentResponse> {
  try {
    const response = await client.patch<CommentResponse>(
      `/posts/${postId}/comments`,
      form,
    );
    return response.data;
  } catch (error) {
    throw new ApiError(getStatusCode(error), getErrorMessage(error));
  }
}

export async function deleteComment(postId: string): Promise<void> {
  try {
    await client.delete(`/posts/${postId}/comments`);
  } catch (error) {
    throw new ApiError(getStatusCode(error), getErrorMessage(error));
  }
}

function getStatusCode(error: unknown): number {
  if (error instanceof AxiosError) {
    return error.response?.status || 500;
  }
  return 500;
}
