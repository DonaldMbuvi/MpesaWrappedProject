import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['html2canvas', 'jspdf'], 
    },
  },
  server: {
    host: true, // Allow LAN and local access
    port: 5173, // Force port 5173
  },
});
