import { type ResolvedRegister, type State, hydrate } from '@wagmi/core'
import { isVue2, ref, watchEffect } from 'vue-demi'
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

    if (isVue2) {
      app.mixin({
        beforeCreate() {
          // HACK: taken from provide(): https://github.com/vuejs/composition-api/blob/master/src/apis/inject.ts#L30
          if (!this._provided) {
            const provideCache = {}
            Object.defineProperty(this, '_provided', {
              get: () => provideCache,
              set: (v) => Object.assign(provideCache, v),
            })
          }

          this._provided[WagmiConfigInjectionKey as unknown as string] = config
        },
      })
    } else {
      app.provide(WagmiConfigInjectionKey, config)
    }
  },
}
