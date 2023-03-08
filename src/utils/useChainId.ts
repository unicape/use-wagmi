import { computed } from 'vue-demi'
import { useProvider } from 'use-wagmi'

import type { SetMaybeRef } from '../types'

export type UseChainIdArgs = SetMaybeRef<{
  chainId?: number
}>

export function useChainId ({
  chainId
}: UseChainIdArgs = {}) {
  const provider = useProvider({ chainId })
  return computed(() => provider.value.network.chainId)
}