import { useQuery as useBaseQuery } from '@tanstack/vue-query'
import type {
  QueryFunction,
  QueryKey,
  UseQueryDefinedReturnType as UQDRT,
  UseQueryReturnType as UQRT,
  UseQueryOptions,
} from '@tanstack/vue-query'
import type { ComputedRef, UnwrapRef } from 'vue-demi'
import { computed } from 'vue-demi'

import { useQueryClient } from './useQueryClient'
import type { MaybeRef } from '../../types'

type UseQueryReturnType<TData, TError> = Omit<UQRT<TData, TError>, 'status'> & {
  status: ComputedRef<'idle' | 'loading' | 'success' | 'error'>
  isIdle: ComputedRef<boolean>
}

type UseQueryDefinedReturnType<TData, TError> = Omit<
  UQDRT<TData, TError>,
  'status'
> & {
  status: ComputedRef<'idle' | 'loading' | 'success' | 'error'>
  isIdle: ComputedRef<boolean>
}

export type UseQueryResult<TData, TError> =
  | UseQueryReturnType<TData, TError>
  | UseQueryDefinedReturnType<TData, TError>

export function useQuery<
  TQueryFnData,
  TError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: MaybeRef<TQueryKey>,
  queryFn: QueryFunction<TQueryFnData, UnwrapRef<TQueryKey>>,
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
): UseQueryResult<TData, TError> {
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
