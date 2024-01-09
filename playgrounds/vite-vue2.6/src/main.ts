import { Buffer } from 'buffer'
import { VueQueryPlugin } from '@tanstack/vue-query'
import VueCompositionApi, { createApp, h } from '@vue/composition-api'
import { UseWagmiPlugin } from 'use-wagmi'
import Vue from 'vue'
import { vueQueryOptions } from './query'
import { config } from './wagmi'

import App from './App.vue'

// `@coinbase-wallet/sdk` uses `Buffer`
globalThis.Buffer = Buffer

Vue.use(VueCompositionApi)
Vue.use(UseWagmiPlugin, { config })
Vue.use(VueQueryPlugin, vueQueryOptions)

createApp({
  render() {
    return h(App)
  },
}).mount('#app')
