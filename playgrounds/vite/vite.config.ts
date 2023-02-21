import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      'use-wagmi': resolve(__dirname, '../../src/index.ts'),
      'use-wagmi/core': resolve(__dirname, '../../src/core/index.ts'),
      'use-wagmi/chains': resolve(__dirname, '../../src/chains/index.ts'),
      'use-wagmi/providers': resolve(__dirname, '../../src/providers/index.ts'),
      'use-wagmi/connectors': resolve(__dirname, '../../src/connectors/index.ts')
    }
  }
})
