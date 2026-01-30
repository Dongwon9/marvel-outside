import client from "./client";
import { ApiError, getErrorMessage } from "./errors";

export type RateType = "LIKE" | "DISLIKE";

export interface RateForm {
  postId: string;
  type: RateType;
}

export interface RateResponse {
  id: string;
  postId: string;
  userId: string;
  type: RateType;
  createdAt: string;
  updatedAt: string;
}

/**
 * 게시글에 좋아요/싫어요 추가
 */
export async function createRate(data: RateForm): Promise<RateResponse> {
  try {
    const response = await client.post<RateResponse>("/rates", data);
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    throw new ApiError((error as any)?.response?.status || 500, message, error);
  }
}

/**
 * 게시글 평가 목록 조회
 */
export async function getRates(postId?: string): Promise<RateResponse[]> {
  try {
    const response = await client.get<RateResponse[]>("/rates", {
      params: postId ? { postId } : undefined,
    });
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    throw new ApiError((error as any)?.response?.status || 500, message, error);
  }
}

/**
 * 특정 평가 조회
 */
export async function getRateById(id: string): Promise<RateResponse> {
  try {
    const response = await client.get<RateResponse>(`/rates/${id}`);
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    throw new ApiError((error as any)?.response?.status || 500, message, error);
  }
}

/**
 * 평가 수정 (좋아요 ↔ 싫어요 변경)
 */
export async function updateRate(
  id: string,
  data: { type: RateType },
): Promise<RateResponse> {
  try {
    const response = await client.patch<RateResponse>(`/rates/${id}`, data);
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    throw new ApiError((error as any)?.response?.status || 500, message, error);
  }
}

/**
 * 평가 삭제 (좋아요/싫어요 제거)
 */
export async function deleteRate(id: string): Promise<void> {
  try {
    await client.delete(`/rates/${id}`);
  } catch (error) {
    const message = getErrorMessage(error);
    throw new ApiError((error as any)?.response?.status || 500, message, error);
  }
}
