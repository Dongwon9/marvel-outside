import client from "./client";
import { ApiError, getErrorMessage } from "./errors";

export interface RateResponse {
  userId: string;
  postId: string;
  isLike: boolean;
}

export interface CreateRateRequest {
  userId: string;
  postId: string;
  isLike: boolean;
}

export interface UpdateRateRequest {
  isLike?: boolean;
}

/**
 * 게시글에 좋아요/싫어요 추가
 */
export async function createRate(
  data: CreateRateRequest,
): Promise<RateResponse> {
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
 * 특정 사용자의 게시글 평가 조회
 */
export async function getRateByPostAndUserId(
  postId: string,
  userId: string,
): Promise<RateResponse> {
  try {
    const response = await client.get<RateResponse>(
      `/rates/${userId}/${postId}`,
    );
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
  userId: string,
  postId: string,
  data: UpdateRateRequest,
): Promise<RateResponse> {
  try {
    const response = await client.patch<RateResponse>(
      `/rates/${userId}/${postId}`,
      data,
    );
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    throw new ApiError((error as any)?.response?.status || 500, message, error);
  }
}

/**
 * 평가 삭제 (좋아요/싫어요 제거)
 */
export async function deleteRate(
  userId: string,
  postId: string,
): Promise<RateResponse> {
  try {
    const response = await client.delete<RateResponse>(
      `/rates/${userId}/${postId}`,
    );
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    throw new ApiError((error as any)?.response?.status || 500, message, error);
  }
}
