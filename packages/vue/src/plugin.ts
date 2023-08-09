import { VueQueryPlugin, type VueQueryPluginOptions } from '@tanstack/vue-query'
import type { PublicClient, WebSocketPublicClient } from '@wagmi/core'
import type { Ref, App } from 'vue-demi'
import { inject, isVue2, markRaw, shallowRef, triggerRef } from 'vue-demi'

import type { Config } from './config'

const USE_WAGMI_KEY = 'USE_WAGMI' as const

export const createVueProvidableConfig = (config: Config, app: App) => {
  const _config = shallowRef(markRaw(config))
  const unsubscribe = config.subscribe(() => {
    triggerRef(markRaw(_config))
  })
  //@todo refactor with app.onUnmount when implemented https://github.com/vuejs/core/issues/4516
  const originalUnmount = app.unmount
  app.unmount = function vueQueryUnmount() {
    unsubscribe()
    originalUnmount()
  }
  return _config
}

export const UseWagmiPlugin = {
  install: (app: App, config: Config) => {
    app.use(VueQueryPlugin, {
      queryClient: config.queryClient,
    } as VueQueryPluginOptions)

    const _config = createVueProvidableConfig(config, app)

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

          this._provided[USE_WAGMI_KEY] = _config
        },
      })
    } else {
      app.provide(USE_WAGMI_KEY, _config)
    }
  },
}

export function useConfig<
  TPublicClient extends PublicClient,
  TWebSocketPublicClient extends WebSocketPublicClient = WebSocketPublicClient,
>() {
  const config =
    inject<Ref<Config<TPublicClient, TWebSocketPublicClient>>>(USE_WAGMI_KEY)
  if (!config?.value)
    throw new Error(
      [
        '`useConfig` must be used within `UseWagmiPlugin`.\n',
        'Read more: https://github.com/unicape/use-wagmi',
      ].join('\n'),
    )

  return config
}
