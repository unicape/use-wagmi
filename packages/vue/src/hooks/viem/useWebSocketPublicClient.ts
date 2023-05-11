import type {
  GetWebSocketPublicClientArgs,
  WebSocketPublicClient,
} from '@wagmi/core'
import {
  getWebSocketPublicClient,
  watchWebSocketPublicClient,
} from '@wagmi/core'
import { readonly, shallowRef, unref, watchEffect } from 'vue-demi'

import type { DeepMaybeRef } from '../../types'

export type UseWebSocketPublicClientArgs = DeepMaybeRef<
  Partial<GetWebSocketPublicClientArgs>
>

export function useWebSocketPublicClient<
  TWebSocketPublicClient extends WebSocketPublicClient,
>({ chainId }: UseWebSocketPublicClientArgs = {}) {
  const webSocketPublicClient = shallowRef(
    getWebSocketPublicClient<TWebSocketPublicClient>({
      chainId: unref(chainId),
    }),
  )

  watchEffect((onCleanup) => {
    const unwatch = watchWebSocketPublicClient<TWebSocketPublicClient>(
      { chainId: unref(chainId) },
      (client) => {
        webSocketPublicClient.value = client
      },
    )

    onCleanup(() => unwatch())
  })

  return readonly(webSocketPublicClient)
}
