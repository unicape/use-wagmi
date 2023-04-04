import { createClient } from '@wagmi/core'
import type { Client, ClientConfig } from '@wagmi/core'
import { inject, markRaw, shallowRef, triggerRef } from 'vue-demi'
import type { App, InjectionKey, Raw, ShallowRef } from 'vue-demi'
import { QueryClient, VueQueryPlugin } from 'vue-query'

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
      networkMode: 'offlineFirst',
      refetchOnWindowFocus: false,
      retry: 0,
    },
    mutations: {
      networkMode: 'offlineFirst',
    },
  },
})

export const WagmiQueryClientKey = 'use-wagmi-query'
export const WagmiInjectionKey: InjectionKey<Raw<ShallowRef<WagmiClient>>> =
  Symbol('use-wagmi')

export function createWagmi({
  queryClient = defaultQueryClient,
  ...config
}: CreateWagmiConfig) {
  const wagmi = createClient(config) as WagmiClient

  wagmi.install = function (app: App) {
    app.use(VueQueryPlugin, {
      queryClient,
      queryClientKey: WagmiQueryClientKey,
    })

    const wagmiRef = shallowRef(wagmi)

    if (wagmi.config.autoConnect) wagmi.autoConnect()

    const markWagmi = markRaw(wagmiRef)
    const unsubscribe = wagmi.subscribe(() => {
      triggerRef(markWagmi)
    })

    const orgUnmount = app.unmount
    app.unmount = function wagmiUnmount() {
      unsubscribe()
      orgUnmount()
    }

    app.provide(WagmiInjectionKey, markWagmi)
    app.config.globalProperties.$wagmi = markWagmi
  }

  return wagmi
}

export function getWagmi() {
  const wagmi = inject(WagmiInjectionKey)
  if (!wagmi) {
    // TODO
    throw new Error(
      'No wagmi client found. Ensure you have set up a client: https://wagmi.sh/react/client',
    )
  }

  return wagmi
}
