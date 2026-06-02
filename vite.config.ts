import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/dist/',
  build: {
    chunkSizeWarningLimit:1500,
    rollupOptions: {
        output:{
            manualChunks(id) {
              if (id.includes('node_modules')) {
                
                  return id.toString().split('node_modules/')[1].split('/')[0].toString();
              }
          }
        }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://www.eventbriteapi.com',
        changeOrigin: true,
        rewrite: (path)=>path.replace(/^\/api/, '')
      }
    }
  }
});
