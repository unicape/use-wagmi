import type { ToRefs, UnwrapRef } from 'vue-demi'
import { useQuery as useBaseQuery } from 'vue-query'

import type {
  DefinedQueryObserverResult,
  QueryFunction,
  QueryKey,
  QueryObserverResult,
  UseQueryReturnType as UQRT,
  UseQueryOptions,
} from 'vue-query'

import { useQueryClient } from './useQueryClient'

type UseQueryReturnType<TData, TError> = Omit<
  UQRT<TData, TError>,
  'refetch' | 'remove'
> & {
  refetch: QueryObserverResult<TData, TError>['refetch']
  remove: QueryObserverResult<TData, TError>['remove']
}

type UseQueryDefinedReturnType<TData, TError> = Omit<
  ToRefs<Readonly<DefinedQueryObserverResult<TData, TError>>>,
  'refetch' | 'remove'
> & {
  suspense: () => Promise<QueryObserverResult<TData, TError>>
  refetch: QueryObserverResult<TData, TError>['refetch']
  remove: QueryObserverResult<TData, TError>['remove']
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
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, UnwrapRef<TQueryKey>>,
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
): UseQueryResult<TData, TError> {
  const queryClient = useQueryClient()
  return useBaseQuery({
    queryKey,
    queryFn,
    ...options,
    queryClient,
  })
}
