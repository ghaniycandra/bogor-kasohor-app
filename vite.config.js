import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  base: '/bogor-kasohor-app/', 
  build: {
    outDir: '../docs',
    emptyOutDir: true, 
  },
});
