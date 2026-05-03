import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: {
    port: 5174,
    proxy: {
      '/api': {
        // 개발 환경에서만 proxy 사용 (프로덕션은 VITE_API_BASE_URL로 직접 호출)
        target: process.env.VITE_API_BASE_URL || 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
  },
});