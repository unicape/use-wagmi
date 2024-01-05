import {
  type DefaultError,
  type MutationObserverResult,
  type QueryKey,
  type UseInfiniteQueryOptions,
  type UseInfiniteQueryReturnType as UIQRT,
  type UseMutationOptions,
  type UseQueryOptions,
  type UseQueryReturnType as UQRT,
  replaceEqualDeep,
  useInfiniteQuery as tanstack_useInfiniteQuery,
  useQuery as tanstack_useQuery,
} from '@tanstack/vue-query'
import {
  type Evaluate,
  type ExactPartial,
  type Omit,
  deepEqual,
} from '@wagmi/core/internal'
import { hashFn } from '@wagmi/core/query'
import { type ToRefs, computed, unref } from 'vue-demi'
import type { DeepUnwrapRef, DistributiveOmit, MaybeRefDeep } from '../types.js'

export type UseMutationParameters<
  data = unknown,
  error = Error,
  variables = void,
  context = unknown,
> = Evaluate<
  MaybeRefDeep<
    Omit<
      DeepUnwrapRef<
        UseMutationOptions<data, error, Evaluate<variables>, context>
      >,
      'mutationFn' | 'mutationKey' | 'throwOnError'
    >
  >
>

type MutationResult<TData, TError, TVariables, TContext> = DistributiveOmit<
  MutationObserverResult<TData, TError, TVariables, TContext>,
  'mutate' | 'reset'
>
export type UseMutationReturnType<
  data = unknown,
  error = Error,
  variables = void,
  context = unknown,
  result = MutationResult<data, error, variables, context>,
> = Evaluate<
  ToRefs<Readonly<result>> & {
    reset: MutationObserverResult<data, error, variables, context>['reset']
  }
>

////////////////////////////////////////////////////////////////////////////////

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
        'initialData'
      >
    > & {
      // Fix `initialData` type
      initialData?:
        | DeepUnwrapRef<
            UseQueryOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>
          >['initialData']
        | undefined
    }
  >
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
  result.queryKey = unref(parameters).queryKey as TQueryKey
  return result
}

////////////////////////////////////////////////////////////////////////////////

export type UseInfiniteQueryParameters<
  queryFnData = unknown,
  error = DefaultError,
  data = queryFnData,
  queryData = queryFnData,
  queryKey extends QueryKey = QueryKey,
  pageParam = unknown,
> = Evaluate<
  Omit<
    UseInfiniteQueryOptions<
      queryFnData,
      error,
      data,
      queryData,
      queryKey,
      pageParam
    >,
    'initialData'
  > & {
    // Fix `initialData` type
    initialData?:
      | UseInfiniteQueryOptions<
          queryFnData,
          error,
          data,
          queryKey
        >['initialData']
      | undefined
  }
>

export type UseInfiniteQueryReturnType<
  data = unknown,
  error = DefaultError,
> = UIQRT<data, error> & {
  queryKey: MaybeRefDeep<QueryKey>
}

// Adding some basic customization.
export function useInfiniteQuery<
  queryFnData,
  error,
  data,
  queryKey extends QueryKey,
>(
  parameters: UseInfiniteQueryParameters<queryFnData, error, data, queryKey> & {
    queryKey: QueryKey
  },
): UseInfiniteQueryReturnType<data, error> {
  const result = tanstack_useInfiniteQuery({
    ...(parameters as any),
    queryKeyHashFn: hashFn, // for bigint support
  }) as UseInfiniteQueryReturnType<data, error>
  result.queryKey = parameters.queryKey
  return result
}

////////////////////////////////////////////////////////////////////////////////

export function structuralSharing<data>(
  oldData: data | undefined,
  newData: data,
): data {
  if (deepEqual(oldData, newData)) return oldData as data
  return replaceEqualDeep(oldData, newData)
}
