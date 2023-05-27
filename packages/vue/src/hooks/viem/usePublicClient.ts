import type { GetPublicClientArgs, PublicClient } from '@wagmi/core'
import { getPublicClient, watchPublicClient } from '@wagmi/core'
import { readonly, shallowRef, unref, watchEffect } from 'vue-demi'

import type { ShallowMaybeRef } from '../../types'

export type UsePublicClientArgs = ShallowMaybeRef<Partial<GetPublicClientArgs>>

export function usePublicClient<TPublicClient extends PublicClient>({
  chainId,
}: UsePublicClientArgs = {}) {
  const publicClient = shallowRef(
    getPublicClient<TPublicClient>({ chainId: unref(chainId) }),
  )

  watchEffect((onCleanup) => {
    const unwatch = watchPublicClient<TPublicClient>(
      { chainId: unref(chainId) },
      (client) => {
        publicClient.value = client
      },
    )

    onCleanup(() => unwatch())
  })

  return readonly(publicClient)
}
