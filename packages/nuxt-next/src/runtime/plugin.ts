import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { UseWagmiPlugin, createConfig } from 'use-wagmi'
import { configKey } from './../name'

export default defineNuxtPlugin((nuxtApp) => {
  const injectedConfig = useRuntimeConfig().public[configKey]

  if (injectedConfig.config) {
    const wagmiConfig = createConfig(injectedConfig.config)
    nuxtApp.vueApp.use(UseWagmiPlugin, { config: wagmiConfig })
    nuxtApp.vueApp.use(VueQueryPlugin)
    console.info('[use-wagmi]: Wagmi configuration loaded')

    return {
      provide: {
        wagmiConfig,
      },
    }
  } else {
    console.warn('[use-wagmi]: No Wagmi configuration found')
  }
})
