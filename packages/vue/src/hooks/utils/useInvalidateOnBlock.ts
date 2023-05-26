import type { QueryKey } from '@tanstack/vue-query'
import { unref } from 'vue-demi'

import { useQueryClient } from './useQueryClient'
import type { MaybeRef } from '../../types'
import { useBlockNumber } from '../network-status'

export type UseInvalidateOnBlockArgs = {
  chainId?: MaybeRef<number>
  enabled?: MaybeRef<boolean>
  queryKey: MaybeRef<QueryKey>
}

export function useInvalidateOnBlock({
  chainId,
  enabled,
  queryKey,
}: UseInvalidateOnBlockArgs) {
  const queryClient = useQueryClient()
  useBlockNumber({
    chainId,
    enabled,
    onBlock: unref(enabled)
      ? () => queryClient.invalidateQueries(unref(queryKey))
      : undefined,
    scopeKey: unref(enabled) ? undefined : 'idle',
  })
}
