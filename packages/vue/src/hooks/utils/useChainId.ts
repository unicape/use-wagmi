import { computed } from 'vue-demi'

import type { ShallowMaybeRef } from '../../types'
import { usePublicClient } from '../viem'

export type UseChainIdArgs = ShallowMaybeRef<{
  chainId?: number
}>

export function useChainId({ chainId }: UseChainIdArgs = {}) {
  const provider = usePublicClient({ chainId })
  return computed(() => provider.value.chain.id)
}
