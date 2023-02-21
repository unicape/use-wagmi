import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      'use-wagmi': resolve(__dirname, '../../src'),
      'use-wagmi/core': resolve(__dirname, '../../src/core'),
      'use-wagmi/chains': resolve(__dirname, '../../src/chains'),
      'use-wagmi/providers': resolve(__dirname, '../../src/providers'),
      'use-wagmi/connectors': resolve(__dirname, '../../src/connectors')
    }
  }
})
