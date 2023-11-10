import { type ResolvedRegister, type State, hydrate } from '@wagmi/core'
import { ref, watchEffect } from 'vue'
import { createInjectionKey } from './utils/createInjectionKey.js'

export const WagmiConfigInjectionKey =
  createInjectionKey<ResolvedRegister['config']>('use-wagmi-config')

export type UseWagmiPluginOptions = {
  config: ResolvedRegister['config']
  initialState?: State | undefined
  reconnectOnMount?: boolean | undefined
}

export const UseWagmiPlugin = {
  install: (app: any, options: UseWagmiPluginOptions) => {
    const { config, initialState, reconnectOnMount = true } = options

    const { onMount } = hydrate(config, {
      initialState,
      reconnectOnMount,
    })

    // Hydrate for non-SSR
    if (!config._internal.ssr) onMount()

    // Hydrate for SSR
    const active = ref(true)
    watchEffect((onCleanup) => {
      if (!active.value) return
      if (!config._internal.ssr) return
      onMount()
      onCleanup(() => {
        active.value = false
      })
    })

    app.provide(WagmiConfigInjectionKey, config)
  },
}
