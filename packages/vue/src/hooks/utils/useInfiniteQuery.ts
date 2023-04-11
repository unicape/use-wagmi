import type { UnwrapRef } from 'vue-demi'
import { useInfiniteQuery as useBaseQuery } from 'vue-query'

import type {
  InfiniteQueryObserverResult,
  QueryFunction,
  QueryKey,
  UseInfiniteQueryOptions,
  UseQueryReturnType,
} from 'vue-query'

import { useQueryClient } from './useQueryClient'

export type UseInfiniteQueryResult<TData, TError> = Omit<
  UseQueryReturnType<TData, TError, InfiniteQueryObserverResult<TData, TError>>,
  'fetchNextPage' | 'fetchPreviousPage' | 'refetch' | 'remove'
> & {
  fetchNextPage: InfiniteQueryObserverResult<TData, TError>['fetchNextPage']
  fetchPreviousPage: InfiniteQueryObserverResult<
    TData,
    TError
  >['fetchPreviousPage']
  refetch: InfiniteQueryObserverResult<TData, TError>['refetch']
  remove: InfiniteQueryObserverResult<TData, TError>['remove']
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
  return useBaseQuery({
    queryKey,
    queryFn,
    ...options,
    queryClient,
  })
}
