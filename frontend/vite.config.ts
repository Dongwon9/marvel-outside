import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0", // Docker 컨테이너에서 외부 접근 허용
    port: 5173,
    strictPort: true, // 포트가 사용 중이면 실패
    watch: {
      usePolling: true, // Docker 볼륨 마운트에서 파일 변경 감지
    },
    proxy: {
      // /api로 시작하는 모든 요청을 백엔드로 자동 전달
      "/api": {
        target: process.env.VITE_API_URL || "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
