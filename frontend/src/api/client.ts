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

export default client;
