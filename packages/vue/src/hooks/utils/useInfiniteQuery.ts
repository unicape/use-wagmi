import { useInfiniteQuery as useBaseQuery } from '@tanstack/vue-query'
import type {
  QueryFunction,
  QueryKey,
  UseInfiniteQueryReturnType as UIQRT,
  UseInfiniteQueryOptions,
} from '@tanstack/vue-query'
import type { ComputedRef, UnwrapRef } from 'vue-demi'
import { computed } from 'vue-demi'

import { useQueryClient } from './useQueryClient'

export type UseInfiniteQueryResult<TData, TError> = Omit<
  UIQRT<TData, TError>,
  'status'
> & {
  status: ComputedRef<'idle' | 'loading' | 'success' | 'error'>
  isIdle: ComputedRef<boolean>
}

export function useInfiniteQuery<
  TQueryFnData,
  TError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, UnwrapRef<TQueryKey>>,
  options: UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
): UseInfiniteQueryResult<TData, TError> {
  const queryClient = useQueryClient()
  const result = useBaseQuery({
    queryKey,
    queryFn,
    ...options,
    queryClient,
  })

  const status = computed(() =>
    result.status.value === 'loading' && result.fetchStatus.value === 'idle'
      ? 'idle'
      : result.status.value,
  )
  const isIdle = computed(() => status.value === 'idle')
  const isLoading = computed(
    () => status.value === 'loading' && result.fetchStatus.value === 'fetching',
  )

  return {
    ...result,
    status,
    isIdle,
    isLoading,
  }
}
