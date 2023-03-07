import { ref, unref, readonly, markRaw, watchEffect } from 'vue-demi'
import { getWebSocketProvider, watchWebSocketProvider } from '@wagmi/core'

import type { GetWebSocketProviderArgs, WebSocketProvider } from '@wagmi/core'
import type { SetMaybeRef } from '../../types'

export type UseWebsocketProviderArgs = SetMaybeRef<Partial<GetWebSocketProviderArgs>>

export function useWebSocketProvider<
  TWebSocketProvider extends WebSocketProvider
> ({
  chainId
}: UseWebsocketProviderArgs = {}) {
  const webSocketProvider = ref(markRaw(getWebSocketProvider<TWebSocketProvider>({ chainId: unref(chainId) }) as TWebSocketProvider))

  watchEffect(onInvalidate => {
    const unwatch = watchWebSocketProvider<TWebSocketProvider>(
      { chainId: unref(chainId) },
      (webSocketProvider_) => {
        webSocketProvider.value = markRaw(webSocketProvider_ || {})
      }
    )

    onInvalidate(() => unwatch())
  })

  return readonly(webSocketProvider)
}