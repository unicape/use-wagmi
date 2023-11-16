import {
  type DefaultError,
  type QueryKey,
  type UseQueryReturnType as UQRT,
  type UseQueryOptions,
  useQuery as tanstack_useQuery,
} from '@tanstack/vue-query'
import {
  type Evaluate,
  type ExactPartial,
  type Omit,
} from '@wagmi/core/internal'
import { hashFn } from '@wagmi/core/query'
import { computed } from 'vue'
import type { MaybeRefDeep, DeepUnwrapRef } from '../types.js'
import { unref } from 'vue'

export type UseQueryParameters<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = MaybeRefDeep<
  Evaluate<
    ExactPartial<
      Omit<
        DeepUnwrapRef<
          UseQueryOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>
        >,
        'queryKey' | 'initialData'
      >
    > & {
      // Fix `initialData` type
      initialData?:
        | DeepUnwrapRef<
            UseQueryOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>
          >['initialData']
        | undefined
    }
  > & {
    queryKey: TQueryKey
  }
>

export type UseQueryReturnType<data = unknown, error = DefaultError> = Evaluate<
  UQRT<data, error> & {
    queryKey: MaybeRefDeep<QueryKey>
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
  >,
): UseQueryReturnType<TData, TError> {
  const options = computed(() => ({
    ...(unref(parameters) as any),
    queryKeyHashFn: hashFn, // for bigint support
  }))

  const result = tanstack_useQuery(options) as UseQueryReturnType<TData, TError>
  result.queryKey = unref(parameters).queryKey
  return result
}
