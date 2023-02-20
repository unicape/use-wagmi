import { createClient, } from '@wagmi/core'
import { shallowRef, triggerRef, markRaw } from 'vue-demi'
import { QueryClient, VueQueryPlugin } from 'vue-query'

import type { App, Ref, InjectionKey } from 'vue-demi'
import type { Client, ClientConfig } from '@wagmi/core'

export type WagmiClient = Client & {
  install(app: App): void
}

export type CreateWagmiConfig = ClientConfig & {
  queryClient?: QueryClient
}

const defaultQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1_000 * 60 * 60 * 24,
      // TODO: uncomment when persistor becomes available
      // networkMode: 'offlineFirst',
      refetchOnWindowFocus: false,
      retry: 0
    },
    mutations: {
      // TODO: uncomment when persistor becomes available
      // networkMode: 'offlineFirst',
    }
  }
})

export const WagmiInjectionKey: InjectionKey<Ref<WagmiClient>> = Symbol('use-wagmi')

export function createWagmi ({
  queryClient = defaultQueryClient,
  ...config
}: CreateWagmiConfig): WagmiClient {
  const wagmi = createClient(config) as WagmiClient

  wagmi.install = function (app: App) {
    app.use(VueQueryPlugin, { queryClient })

    const wagmiRef = shallowRef(wagmi)

    if (wagmi.config.autoConnect)
      wagmi.autoConnect()

    const markWagmi = markRaw(wagmiRef)
    const unsubscribe = wagmi.subscribe(() => {
      triggerRef(markWagmi)
    })

    const orgUnmount = app.unmount
    app.unmount = function wagmiUnmount () {
      unsubscribe()
      orgUnmount()
    }

    app.provide(WagmiInjectionKey, markWagmi)
    app.config.globalProperties.$wagmi = markWagmi
  }

  return wagmi
}