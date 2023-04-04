import { computed } from 'vue-demi'
import { useProvider } from '../providers'

import type { DeepMaybeRef } from '../../types'

export type UseChainIdArgs = DeepMaybeRef<{
  chainId?: number
}>

export function useChainId ({
  chainId
}: UseChainIdArgs = {}) {
  const provider = useProvider({ chainId })
  return computed(() => provider.value.network.chainId)
}