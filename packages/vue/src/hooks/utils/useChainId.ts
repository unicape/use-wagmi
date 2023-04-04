import { computed } from 'vue-demi'

import type { DeepMaybeRef } from '../../types'
import { useProvider } from '../providers'

export type UseChainIdArgs = DeepMaybeRef<{
  chainId?: number
}>

export function useChainId({ chainId }: UseChainIdArgs = {}) {
  const provider = useProvider({ chainId })
  return computed(() => provider.value.network.chainId)
}
