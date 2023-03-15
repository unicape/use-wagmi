import { unref } from 'vue-demi'
import { useQueryClient } from './useQueryClient'
import { useBlockNumber } from '../core/network-status'

import type { QueryKey } from 'vue-query'
import type { DeepMaybeRef } from '../types'

export type UseInvalidateOnBlockArgs = DeepMaybeRef<{
  chainId?: number,
  enabled?: boolean,
  queryKey: QueryKey
}>

export function useInvalidateOnBlock ({
  chainId,
  enabled,
  queryKey
}: UseInvalidateOnBlockArgs) {
  const queryClient = useQueryClient()
  useBlockNumber({
    chainId,
    enabled,
    onBlock: unref(enabled)
      ? () => queryClient.invalidateQueries(queryKey)
      : undefined,
    scopeKey: unref(enabled) ? undefined : 'idle'
  })
}