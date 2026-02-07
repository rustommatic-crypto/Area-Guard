
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // This allows process.env to work in the browser
    'process.env': process.env
  },
  server: {
    port: 3000
  }
});
