import { computed } from 'vue-demi'

import type { DeepMaybeRef } from '../../types'
import { usePublicClient } from '../viem'

export type UseChainIdArgs = DeepMaybeRef<{
  chainId?: number
}>

export function useChainId({ chainId }: UseChainIdArgs = {}) {
  const provider = usePublicClient({ chainId })
  return computed(() => provider.value.chain.id)
}
