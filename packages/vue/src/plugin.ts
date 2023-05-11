import { VueQueryPlugin, type VueQueryPluginOptions } from '@tanstack/vue-query'
import type { PublicClient, WebSocketPublicClient } from '@wagmi/core'
import { inject, isVue2 } from 'vue-demi'

import type { Config } from './config'

const USE_WAGMI_KEY = 'USE_WAGMI' as const

export const UseWagmiPlugin = {
  install: (app: any, config: Config) => {
    app.use(VueQueryPlugin, {
      queryClient: config.queryClient,
    } as VueQueryPluginOptions)

    const cleanup = () => {
      config.destroy()
    }

    if (app.onUnmount) {
      app.onUnmount(cleanup)
    } else {
      const originalUnmount = app.unmount
      app.unmount = function vueQueryUnmount() {
        cleanup()
        originalUnmount()
      }
    }

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

          this._provided[USE_WAGMI_KEY] = config
        },
      })
    } else {
      app.provide(USE_WAGMI_KEY, config)
    }
  },
}

export function useConfig<
  TPublicClient extends PublicClient,
  TWebSocketPublicClient extends WebSocketPublicClient = WebSocketPublicClient,
>() {
  const config =
    inject<Config<TPublicClient, TWebSocketPublicClient>>(USE_WAGMI_KEY)
  if (!config)
    throw new Error(
      [
        '`useConfig` must be used within `UseWagmiPlugin`.\n',
        'Read more: https://github.com/unicape/use-wagmi',
      ].join('\n'),
    )

  return config
}
