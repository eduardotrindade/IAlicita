import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Evita falhas no Windows quando "localhost" resolve só para IPv6
    host: '127.0.0.1',
    port: 5173,
    strictPort: false,
    open: true,
    proxy: {
      '/api-pncp': {
        target: 'https://pncp.gov.br',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-pncp/, ''),
      },
      '/api-transparencia': {
        target: 'https://api.portaldatransparencia.gov.br',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-transparencia/, ''),
      }
    }
  },
  preview: {
    host: '127.0.0.1',
    port: 4173,
    strictPort: false,
    open: true,
  },
})
