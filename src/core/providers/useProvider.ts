import { ref, unref, markRaw, readonly, watchEffect } from 'vue-demi'
import { getProvider, watchProvider } from '@wagmi/core'

import type { GetProviderArgs, Provider } from '@wagmi/core'
import type { DeepMaybeRef } from '../../types'

export type UseProviderArgs = DeepMaybeRef<Partial<GetProviderArgs>>

export function useProvider<TProvider extends Provider> ({
  chainId
}: UseProviderArgs = {}) {
  const provider = ref((markRaw(getProvider<TProvider>({ chainId: unref(chainId) }))))

  watchEffect(onInvalidate => {
    const unwatch = watchProvider<TProvider>(
      { chainId: unref(chainId) },
      (provider_) => {
        provider.value = markRaw(provider_)
      }
    )

    onInvalidate(() => unwatch())
  })

  return readonly(provider)
}