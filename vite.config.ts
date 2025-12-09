import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,  // 改用 5174
    strictPort: false,  // 如果被佔用就自動找下一個可用 port
    host: true
  }
})