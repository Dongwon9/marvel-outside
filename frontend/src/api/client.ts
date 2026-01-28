import axios from "axios";

const client = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // httpOnly 쿠키를 위해 필수
});

// 요청 인터셉터: 더 이상 토큰을 수동으로 추가할 필요 없음 (쿠키가 자동 전송됨)
client.interceptors.request.use(
  (config) => config,
  (error: Error) => Promise.reject(error),
);

// 응답 인터셉터: 오류 처리
client.interceptors.response.use(
  (response) => response,
  (error) => {
    // 네트워크 오류 또는 서버 응답 없음
    if (!error.response) {
      console.error("네트워크 오류:", error.message);
    }
    return Promise.reject(error);
  },
);

export default client;
