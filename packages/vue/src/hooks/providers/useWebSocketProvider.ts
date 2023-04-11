import { getWebSocketProvider, watchWebSocketProvider } from '@wagmi/core'

import type { GetWebSocketProviderArgs, WebSocketProvider } from '@wagmi/core'
import { shallowRef, unref, watchEffect } from 'vue-demi'

import type { DeepMaybeRef } from '../../types'

export type UseWebsocketProviderArgs = DeepMaybeRef<
  Partial<GetWebSocketProviderArgs>
>

export function useWebSocketProvider<
  TWebSocketProvider extends WebSocketProvider,
>({ chainId }: UseWebsocketProviderArgs = {}) {
  const webSocketProvider = shallowRef(
    getWebSocketProvider<TWebSocketProvider>({
      chainId: unref(chainId),
    }),
  )

  watchEffect((onCleanup) => {
    const unwatch = watchWebSocketProvider<TWebSocketProvider>(
      { chainId: unref(chainId) },
      (webSocketProvider_) => {
        webSocketProvider.value = webSocketProvider_ as TWebSocketProvider
      },
    )

    onCleanup(() => unwatch())
  })

  return webSocketProvider
}
