import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
    server: {
    port: 3001,
    proxy: {
      // 将/api开头的请求代理到本地3000端口（去掉/api前缀）
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // 将/uploads开头的请求代理到本地3000端口（静态资源）
      '/uploads': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      // 配置 @ 指向 src 目录
      '@': path.resolve(__dirname, './src'),
    },
  },
})
