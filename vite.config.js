import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: './',
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    target: 'es2022',
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['tests/setup.js']
  }
});