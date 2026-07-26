import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Avoid browser CORS when pulling Release Gate Lab's /api/runs in local dev.
      '/release-gate-api': {
        target: 'https://release-gate-lab.vercel.app',
        changeOrigin: true,
        rewrite: () => '/api/runs',
      },
    },
  },
})
