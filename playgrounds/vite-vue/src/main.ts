import { Buffer } from 'buffer'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { UseWagmiPlugin } from 'use-wagmi'
import { createApp } from 'vue-demi'
import App from './App.vue'
import { vueQueryOptions } from './query'
import { config } from './wagmi'

// `@coinbase-wallet/sdk` uses `Buffer`
globalThis.Buffer = Buffer

createApp(App)
  .use(UseWagmiPlugin, { config })
  .use(VueQueryPlugin, vueQueryOptions)
  .mount('#app')
