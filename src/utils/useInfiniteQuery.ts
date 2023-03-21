import { useInfiniteQuery as useBaseQuery } from 'vue-query'
import { WagmiQueryClientKey as queryClientKey } from '../create'

import type { UnwrapRef } from 'vue-demi'
import type {
  QueryKey,
  QueryFunction,
  UseQueryReturnType,
  UseInfiniteQueryOptions,
  InfiniteQueryObserverResult
} from 'vue-query'

type InfiniteQueryReturnType<TData, TError> = UseQueryReturnType<
  TData,
  TError,
  InfiniteQueryObserverResult<TData, TError>
>
type UseInfiniteQueryReturnType<TData, TError> = Omit<
  InfiniteQueryReturnType<TData, TError>,
  "fetchNextPage" | "fetchPreviousPage" | "refetch" | "remove"
> & {
  fetchNextPage: InfiniteQueryObserverResult<TData, TError>["fetchNextPage"]
  fetchPreviousPage: InfiniteQueryObserverResult<
    TData,
    TError
  >["fetchPreviousPage"]
  refetch: InfiniteQueryObserverResult<TData, TError>["refetch"]
  remove: InfiniteQueryObserverResult<TData, TError>["remove"]
}

export function useInfiniteQuery<
  TQueryFnData,
  TError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> (
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, UnwrapRef<TQueryKey>>,
  options: UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>
): UseInfiniteQueryReturnType<TData, TError> {
  return useBaseQuery({
    queryKey,
    queryFn,
    queryClientKey,
    ...options
  })
}