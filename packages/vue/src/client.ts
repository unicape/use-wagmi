import type {
  ClientConfig,
  Client as CoreClient,
  Provider,
  WebSocketProvider,
} from '@wagmi/core'
import {
  createClient as createCoreClient,
  createStorage,
  noopStorage,
} from '@wagmi/core'
import type { Plugin } from 'vue-demi'
import { inject, isVue2 } from 'vue-demi'
import { QueryClient, VueQueryPlugin } from 'vue-query'

export type CreateClientConfig<
  TProvider extends Provider = Provider,
  TWebSocketProvider extends WebSocketProvider = WebSocketProvider,
> = ClientConfig<TProvider, TWebSocketProvider> & {
  queryClient?: QueryClient
}

const USE_WAGMI_INJECTION_KEY = 'USE_WAGMI' as const

export function createClient<
  TProvider extends Provider = Provider,
  TWebSocketProvider extends WebSocketProvider = WebSocketProvider,
>({
  queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        cacheTime: 1_000 * 60 * 60 * 24, // 24 hours
        networkMode: 'offlineFirst',
        refetchOnWindowFocus: false,
        retry: 0,
      },
      mutations: {
        networkMode: 'offlineFirst',
      },
    },
  }),
  storage = createStorage({
    storage:
      typeof window !== 'undefined' && window.localStorage
        ? window.localStorage
        : noopStorage,
  }),
  ...config
}: CreateClientConfig<TProvider, TWebSocketProvider>) {
  const client = createCoreClient<TProvider, TWebSocketProvider>({
    ...config,
    storage,
  })
  return Object.assign(client, {
    queryClient,
    install(app: any) {
      app.use(VueQueryPlugin, {
        queryClient: (client as Client<TProvider, TWebSocketProvider>)
          .queryClient,
      })

      const cleanup = () => {
        client.destroy()
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

            this._provided[USE_WAGMI_INJECTION_KEY] = client
          },
        })
      } else {
        app.provide(USE_WAGMI_INJECTION_KEY, client)
      }
    },
  }) as Client
}

export type Client<
  TProvider extends Provider = Provider,
  TWebSocketProvider extends WebSocketProvider = WebSocketProvider,
> = CoreClient<TProvider, TWebSocketProvider> &
  Plugin & { queryClient: QueryClient }

export function useClient<
  TProvider extends Provider,
  TWebSocketProvider extends WebSocketProvider = WebSocketProvider,
>() {
  const client = inject(USE_WAGMI_INJECTION_KEY) as unknown as Client<
    TProvider,
    TWebSocketProvider
  >
  if (!client)
    throw new Error(
      [
        '`useClient` must be used within `WagmiConfig`.\n',
        'Read more: https://wagmi.sh/react/WagmiConfig',
      ].join('\n'),
    )

  return client
}
