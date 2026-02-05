import axios from "axios";

import client from "./client";
import { ApiError, getErrorMessage } from "./errors";

function getStatusCode(error: unknown): number {
  if (axios.isAxiosError(error)) {
    return error.response?.status ?? 500;
  }
  return 500;
}

export interface Board {
  id: string;
  name: string;
  description?: string;
}

export async function getBoards(): Promise<Board[]> {
  try {
    const response = await client.get<Board[]>("/boards");
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    throw new ApiError(getStatusCode(error), message, error);
  }
}

export async function getBoardById(id: string): Promise<Board> {
  try {
    const response = await client.get<Board>(`/boards/${id}`);
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    throw new ApiError(getStatusCode(error), message, error);
  }
}

export async function createBoard(data: {
  name: string;
  description?: string;
}): Promise<Board> {
  try {
    const response = await client.post<Board>("/boards", data);
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    throw new ApiError(getStatusCode(error), message, error);
  }
}

export async function updateBoard(
  id: string,
  data: { name: string; description?: string },
): Promise<Board> {
  try {
    const response = await client.patch<Board>(`/boards/${id}`, data);
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    throw new ApiError(getStatusCode(error), message, error);
  }
}

export async function deleteBoard(id: string): Promise<void> {
  try {
    await client.delete(`/boards/${id}`);
  } catch (error) {
    const message = getErrorMessage(error);
    throw new ApiError(getStatusCode(error), message, error);
  }
}
