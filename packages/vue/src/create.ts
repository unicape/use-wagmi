import { createClient } from '@wagmi/core'
import type {
  Client,
  ClientConfig,
  Provider,
  WebSocketProvider,
} from '@wagmi/core'
import { inject, markRaw, shallowRef, triggerRef } from 'vue-demi'
import type { App, Raw, ShallowRef } from 'vue-demi'
import { QueryClient, VueQueryPlugin } from 'vue-query'

export type WagmiClient<
  TProvider extends Provider = Provider,
  TWebSocketProvider extends WebSocketProvider = WebSocketProvider,
> = Client<TProvider, TWebSocketProvider> & {
  install(app: App): void
}

export type CreateWagmiConfig<
  TProvider extends Provider = Provider,
  TWebSocketProvider extends WebSocketProvider = WebSocketProvider,
> = ClientConfig<TProvider, TWebSocketProvider> & {
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
export const WagmiInjectionKey = Symbol('use-wagmi')

export function createWagmi<
  TProvider extends Provider = Provider,
  TWebSocketProvider extends WebSocketProvider = WebSocketProvider,
>({
  queryClient = defaultQueryClient,
  ...config
}: CreateWagmiConfig<TProvider, TWebSocketProvider>) {
  const wagmi = createClient<TProvider, TWebSocketProvider>(
    config,
  ) as WagmiClient<TProvider, TWebSocketProvider>

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

export function getWagmi<
  TProvider extends Provider = Provider,
  TWebSocketProvider extends WebSocketProvider = WebSocketProvider,
>() {
  const wagmi = inject(WagmiInjectionKey) as unknown as Raw<
    ShallowRef<WagmiClient<TProvider, TWebSocketProvider>>
  >
  if (!wagmi)
    throw new Error(
      [
        '`getWagmi` must be used within `createWagmi`.\n',
        'Read more: https://github.com/unicape/use-wagmi',
      ].join('\n'),
    )

  return wagmi
}
