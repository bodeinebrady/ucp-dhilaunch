import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/prototype/',
  appType: 'spa',
  build: {
    outDir: 'dist/prototype',
    emptyOutDir: true,
  },
})
