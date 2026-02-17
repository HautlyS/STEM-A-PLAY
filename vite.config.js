import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const getBase = () => {
  if (process.env.GITHUB_PAGES === 'true') {
    return '/STEM-A-PLAY/'
  }
  return '/'
}

// https://vite.dev/config/
export default defineConfig({
  base: getBase(),
  plugins: [vue()],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router'],
          'three-vendor': ['three'],
        },
      },
    },
    chunkSizeWarningLimit: 700,
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'three'],
  },
})
