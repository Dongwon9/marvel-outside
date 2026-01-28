import axios from "axios";

export class ApiError extends Error {
  statusCode: number;
  originalError?: unknown;

  constructor(statusCode: number, message: string, originalError?: unknown) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.originalError = originalError;
  }
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as { message?: string } | undefined;

    // 서버에서 제공한 메시지가 있으면 사용
    if (data?.message) {
      return data.message;
    }

    // HTTP 상태 코드에 따른 기본 메시지
    switch (status) {
      case 400:
        return "잘못된 요청입니다. 입력 정보를 확인해주세요.";
      case 401:
        return "이메일 또는 비밀번호가 올바르지 않습니다.";
      case 403:
        return "접근 권한이 없습니다.";
      case 404:
        return "요청한 리소스를 찾을 수 없습니다.";
      case 409:
        return "이미 존재하는 정보입니다.";
      case 422:
        return "입력한 정보가 유효하지 않습니다.";
      case 429:
        return "너무 많은 요청을 보냈습니다. 잠시 후 다시 시도해주세요.";
      case 500:
        return "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
      case 502:
        return "서버 연결에 문제가 있습니다.";
      case 503:
        return "서비스를 일시적으로 사용할 수 없습니다.";
      default:
        return error.message || "알 수 없는 오류가 발생했습니다.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "알 수 없는 오류가 발생했습니다.";
}

export function handleApiError(error: unknown): never {
  const message = getErrorMessage(error);
  const statusCode = axios.isAxiosError(error)
    ? error.response?.status || 500
    : 500;

  throw new ApiError(statusCode, message, error);
}
