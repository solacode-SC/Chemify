import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/katex')) {
            return 'vendor-katex';
          }
          if (id.includes('node_modules/react') || id.includes('node_modules/canvas-confetti')) {
            return 'vendor-react';
          }
          if (id.includes('/src/data/crashCourse') || id.includes('/src/data/toolsCrashCourseData')) {
            return 'data-crash-course';
          }
          if (id.includes('/src/data/elementDetailsData') || id.includes('/src/data/elementsData')) {
            return 'data-elements';
          }
        }
      }
    }
  }
});
