import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        phone: resolve(__dirname, 'phone.html')
      }
    }
  },
  server: {
    port: 3000
  }
});
