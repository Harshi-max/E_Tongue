import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://e-tongue-2.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      },
      '/predict': {
        target: 'https://e-tongue-2.onrender.com',
        changeOrigin: true
      },
      '/health': {
        target: 'https://e-tongue-2.onrender.com',
        changeOrigin: true
      }
    }
  }
})

