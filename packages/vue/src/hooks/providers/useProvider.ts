import { getProvider, watchProvider } from '@wagmi/core'

import type { GetProviderArgs, Provider } from '@wagmi/core'
import { shallowRef, unref, watchEffect } from 'vue-demi'

import type { DeepMaybeRef } from '../../types'

export type UseProviderArgs = DeepMaybeRef<Partial<GetProviderArgs>>

export function useProvider<TProvider extends Provider>({
  chainId,
}: UseProviderArgs = {}) {
  const provider = shallowRef(
    getProvider<TProvider>({ chainId: unref(chainId) }),
  )

  watchEffect((onCleanup) => {
    const unwatch = watchProvider<TProvider>(
      { chainId: unref(chainId) },
      (provider_) => {
        provider.value = provider_
      },
    )

    onCleanup(() => unwatch())
  })

  return provider
}
