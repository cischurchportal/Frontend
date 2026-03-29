import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://asc-be-fpbtg4e5djaadcez.centralindia-01.azurewebsites.net',
        changeOrigin: true
      }
      // '/api': {
      //   target: 'http://localhost:7071',  // Azure Functions default port
      //   changeOrigin: true
      // }
      // Note: /blob proxy removed - images now served directly from Cloudflare R2
    }
  }
})