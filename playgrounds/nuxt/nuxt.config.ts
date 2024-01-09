import inject from '@rollup/plugin-inject'
import { defineNuxtConfig } from 'nuxt/config'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  ssr: false,

  vite: {
    build: {
      rollupOptions: {
        plugins: [inject({ Buffer: ['buffer', 'Buffer'] })],
      },
    },
  },

  modules: [
    [
      '@use-wagmi/nuxt',
      {
        excludeImports: ['useQuery'],
      },
    ],
  ],
})
