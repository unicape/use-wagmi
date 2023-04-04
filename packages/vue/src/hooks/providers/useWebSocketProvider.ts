import { getWebSocketProvider, watchWebSocketProvider } from '@wagmi/core'

import type { GetWebSocketProviderArgs, WebSocketProvider } from '@wagmi/core'
import { readonly, ref, unref, watchEffect } from 'vue-demi'

import type { DeepMaybeRef } from '../../types'

export type UseWebsocketProviderArgs = DeepMaybeRef<
  Partial<GetWebSocketProviderArgs>
>

export function useWebSocketProvider<
  TWebSocketProvider extends WebSocketProvider,
>({ chainId }: UseWebsocketProviderArgs = {}) {
  const webSocketProvider = ref(
    getWebSocketProvider<TWebSocketProvider>({
      chainId: unref(chainId),
    }) as TWebSocketProvider,
  )

  watchEffect((onInvalidate) => {
    const unwatch = watchWebSocketProvider<TWebSocketProvider>(
      { chainId: unref(chainId) },
      (webSocketProvider_) => {
        webSocketProvider.value = webSocketProvider_
      },
    )

    onInvalidate(() => unwatch())
  })

  return readonly(webSocketProvider)
}
