import { useQuery as useBaseQuery } from 'vue-query'
import { WagmiQueryClientKey as queryClientKey } from '../create'

import type { UnwrapRef } from 'vue-demi'
import type { QueryKey, QueryFunction, UseQueryOptions } from 'vue-query'

export function useQuery<
  TQueryFnData,
  TError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> (
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, UnwrapRef<TQueryKey>>,
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
) {
  return useBaseQuery({
    queryKey,
    queryFn,
    queryClientKey,
    ...options
  })
}