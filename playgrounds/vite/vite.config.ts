import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      'use-wagmi': resolve(__dirname, '../../src'),
      'use-wagmi/*': resolve(__dirname, '../../src/*'),
    },
  },
})
