import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/',
  define: {
    global: 'window'
  },
  
  // Bloco de 'resolve' corrigido sem 'front-end/'
  resolve: {
    alias: {
      'assets': path.resolve(__dirname, './front-end/src/assets'),
      'components': path.resolve(__dirname, './front-end/src/components'),
      'contexts': path.resolve(__dirname, './front-end/src/contexts'),
      'hooks': path.resolve(__dirname, './front-end/src/hooks'),
      'layout': path.resolve(__dirname, './front-end/src/layout'),
      'routes': path.resolve(__dirname, './front-end/src/routes'),
      'services': path.resolve(__dirname, './front-end/src/services'),
      'store': path.resolve(__dirname, './front-end/src/store'),
      'themes': path.resolve(__dirname, './front-end/src/themes'),
      'ui-component': path.resolve(__dirname, './front-end/src/ui-component'),
      'utils': path.resolve(__dirname, './front-end/src/utils'),
      'views': path.resolve(__dirname, './front-end/src/views'),
      'menu-items': path.resolve(__dirname, './front-end/src/menu-items'),
      'config': path.resolve(__dirname, './front-end/src/config.js')
    }
  },

  optimizeDeps: {
    include: ['recharts', 'es-toolkit'],
  },
  server: {
    open: '/login',
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:4001',
        changeOrigin: true,
      }
    }
  },
  preview: {
    open: true,
    port: 3000
  },
  build: {
    sourcemap: true
  }
});