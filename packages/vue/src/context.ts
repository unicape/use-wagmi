import type { Provider, WebSocketProvider } from '@wagmi/core'
import type { ExtractPropTypes, InjectionKey, PropType } from 'vue-demi'

import { defineComponent, getCurrentInstance, inject, provide } from 'vue-demi'
import { VueQueryPlugin } from 'vue-query'

import type { Client } from './client'

function createInjectionKey<T>(key: string): InjectionKey<T> {
  return key as any
}

export const queryClientKey = 'wagmi-query-client'
const wagmiConfigInjectionKey = createInjectionKey<Client>('wagmi-config')

export type WagmiConfigProps = Required<
  ExtractPropTypes<typeof wagmiConfigProps>
>

const wagmiConfigProps = {
  client: Object as PropType<Client>,
}

export const WagmiConfig = defineComponent({
  name: 'WagmiConfig',
  props: wagmiConfigProps,
  setup(props) {
    const inatance = getCurrentInstance()
    inatance?.appContext.app.use(VueQueryPlugin, {
      queryClient: props.client?.queryClient,
      queryClientKey,
    })
    provide(wagmiConfigInjectionKey, props.client)
  },
  render() {
    return this.$slots.default?.()
  },
})

export function useClient<
  TProvider extends Provider,
  TWebSocketProvider extends WebSocketProvider = WebSocketProvider,
>() {
  const client = inject(wagmiConfigInjectionKey) as unknown as Client<
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
