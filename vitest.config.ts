import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // describe, it, expect 전역 사용
    environment: "jsdom", // 브라우저 환경 시뮬레이션
    setupFiles: "./setupTests.ts", // 테스트 실행 전 공통 세팅 파일
    css: true, // Tailwind 같은 CSS 임포트 가능
  },
});
