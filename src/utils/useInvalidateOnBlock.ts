import { useQueryClient } from './useQueryClient'

import type { QueryKey } from 'vue-query'

export function useInvalidateOnBlock ({

}: {
  chainId?: number,
  enabled?: boolean,
  queryKey: QueryKey
}) {
  const queryClient = useQueryClient()
}