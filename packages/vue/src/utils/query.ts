import {
  type DefaultError,
  type QueryKey,
  type UseQueryReturnType as UQRT,
  type QueryObserverOptions,
  useQuery as tanstack_useQuery,
} from '@tanstack/vue-query'
import {
  type Evaluate,
  type ExactPartial,
  type Omit,
} from '@wagmi/core/internal'
import { hashFn } from '@wagmi/core/query'
import type { UnwrapRef } from 'vue'
import type {
  WithRequired,
  MaybeRef,
  DeepMaybeRef,
  DeepUnwrapRef,
  MaybeRefOrGetter,
} from '../types.js'

////////////////////////////////////////////////////////////////////////////////

type UseQueryOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = {
  [Property in
    keyof QueryObserverOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryData,
      TQueryKey
    >]: Property extends 'queryFn'
    ? QueryObserverOptions<
        TQueryFnData,
        TError,
        TData,
        TQueryData,
        DeepUnwrapRef<TQueryKey>
      >[Property]
    : Property extends 'enabled'
    ? MaybeRefOrGetter<
        QueryObserverOptions<
          TQueryFnData,
          TError,
          TData,
          TQueryData,
          TQueryKey
        >[Property]
      >
    : DeepMaybeRef<
        WithRequired<
          QueryObserverOptions<
            TQueryFnData,
            TError,
            TData,
            TQueryData,
            TQueryKey
          >,
          'queryKey'
        >[Property]
      >
}

export type UseQueryParameters<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = Evaluate<
  ExactPartial<
    Omit<
      UseQueryOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>,
      | 'initialData'
      | 'queryHash'
      | 'queryKey'
      | 'queryKeyHashFn'
      | 'throwOnError'
    >
  > & {
    // Fix `initialData` type
    initialData?: UnwrapRef<
      UseQueryOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>
    >['initialData']
  }
>

export type UseQueryReturnType<data = unknown, error = DefaultError> = Evaluate<
  UQRT<data, error> & {
    queryKey: MaybeRef<QueryKey>
  }
>

// Adding some basic customization.
// Ideally we don't have this function, but `import('@tanstack/react-query').useQuery` currently has some quirks where it is super hard to
// pass down the inferred `initialData` type because of it's discriminated overload in the on `useQuery`.
export function useQuery<
  TQueryFnData,
  TError,
  TData,
  TQueryData,
  TQueryKey extends QueryKey,
>(
  parameters: UseQueryParameters<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey
  > & {
    queryKey: MaybeRef<TQueryKey>
  },
): UseQueryReturnType<TData, TError> {
  const result = tanstack_useQuery({
    ...(parameters as any),
    queryKeyHashFn: hashFn, // for bigint support
  }) as UseQueryReturnType<TData, TError>
  result.queryKey = parameters.queryKey
  return result
}
