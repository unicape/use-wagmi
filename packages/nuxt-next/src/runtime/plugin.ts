import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { UseWagmiPlugin, createConfig } from 'use-wagmi'
import { configKey } from './../module'

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig().public[configKey]
    if(!config) {
        const wagmiConfig = createConfig(config)
        nuxtApp.vueApp.use(UseWagmiPlugin, { wagmiConfig })
        nuxtApp.vueApp.use(VueQueryPlugin)
        console.log('Wagmi configuration loaded');
    }
});
